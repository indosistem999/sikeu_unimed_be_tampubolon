import AppDataSource from '../../../config/dbconfig';
import { Users } from '../../../database/models/Users';
import { I_ResultService } from '../../../interfaces/app.interface';
import {
  I_AuthRepository,
  I_AuthUserPayload,
  I_LoginRequest,
  I_RequestToken,
  I_RegisterRequest,
  I_ResetPassword,
  I_RequestRefreshToken,
  I_RequestVerifiedOTP,
} from '../../../interfaces/auth.interface';
import { MessageDialog } from '../../../lang';
import { encryptPassword, generateSalt, hashedPassword } from '../../../lib/utils/bcrypt.util';
import { formatDateToday, generateOTPCode, getTotalDays, getTotalMinutes, standartDateISO } from '../../../lib/utils/common.util';
import { generatedToken, verifiedToken } from '../../../lib/utils/jwt.util';
import UserLogRepository from '../user_log/repository'
import { LogType as logType } from '../../../constanta'
import RoleRepository from '../role/repository';
import { eventPublishMessageToSendEmail } from '../../../events/publishers/email.publisher';
import { optionalEmail } from '../../../constanta'

import bcrypt from 'bcrypt';
import { IsNull } from 'typeorm';
import { RoleModuleAssociation } from '../../../database/models/RoleModuleAssociation';
import { selectDetailMenu } from '../master_menu/constanta';
import { makeFullUrlFile } from '../../../config/storages';
import { Roles } from '../../../database/models/Roles';

class AuthRepository implements I_AuthRepository {
  private userRepo = AppDataSource.getRepository(Users);
  private roleModuleAssocRepo = AppDataSource.getRepository(RoleModuleAssociation)

  private userLogRepository: UserLogRepository;
  private roleRepository: RoleRepository;

  constructor() {
    this.userLogRepository = new UserLogRepository();
    this.roleRepository = new RoleRepository();
  }

  setupErrorMessage(error: any): I_ResultService {
    return {
      success: false,
      message: error.message,
      record: error
    }
  }

  /** Login */
  async signIn(payload: I_LoginRequest, others: any): Promise<I_ResultService> {
    try {
      let user = await this.userRepo.findOne({
        where: {
          email: payload.email,
        },
        relations: ['role'],
      });

      if (!user) {
        return {
          success: false,
          message: MessageDialog.__('error.invalid.emailEntry'),
          record: user,
        };
      }

      const hashedPassword = await bcrypt.hash(payload.password, user.salt)
      if (user.password !== hashedPassword) {
        return {
          success: false,
          message: MessageDialog.__('error.invalid.password'),
          record: user,
        };
      }

      // Create JWT Payload and Generate Token Access
      const jwtPayload: I_AuthUserPayload = {
        user_id: user.user_id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: {
          role_id: user.role?.role_id,
          role_name: user.role?.role_name,
          role_slug: user.role?.role_slug,
        }
      };

      const access_token = generatedToken(jwtPayload);
      const refresh_token = generatedToken(jwtPayload, '7d');


      // const today = others?.last_login
      // const totalDays = user?.last_login == null ? 1 : getTotalDays(today, user?.last_login)


      // user.last_login = today;
      // user.last_ip = others?.request_ip,
      //   user.last_hostname = others?.request_host
      // user.security_question_answer = payload.security_question_answer;
      // user.refresh_token = refresh_token;
      // user = await this.userRepo.save(user);

      // // Create Log Activity
      // if (totalDays >= 1) {
      //   const resultLog = await this.userLogRepository.store({
      //     activity_time: others.last_login,
      //     activity_type: logType.Login,
      //     user,
      //     description: `User has signed in at ${today} on IP: ${others?.request_ip}, Hostname: ${others?.request_host}`
      //   })

      //   if (!resultLog.success) {
      //     return resultLog;
      //   }
      // }

      return {
        success: true,
        message: MessageDialog.__('success.auth.login'),
        record: {
          access_token,
          refresh_token,
        },
      };
    } catch (err: any) {
      return this.setupErrorMessage(err)
    }
  }

  /** Register */
  async signUp(payload: I_RegisterRequest): Promise<I_ResultService> {
    const { first_name, last_name, password, email } = payload;
    const { salt, password_hash } = await encryptPassword(password);

    try {

      const customerRole = await this.roleRepository.fetchOneByParam({ where: { role_name: 'customer' } })

      if (!customerRole.success) {
        return customerRole
      }

      const today: Date = new Date(standartDateISO());

      const user = await this.userRepo.save(this.userRepo.create({
        first_name,
        last_name,
        email,
        salt,
        password: password_hash,
        registered_date: today,
        is_active: 1,
        role: { ...customerRole.record }
      }))

      if (!user) {
        return {
          success: false,
          message: MessageDialog.__('error.failed.registerAccount'),
          record: user,
        };
      }

      const resultLog = await this.userLogRepository.store({
        activity_time: today,
        activity_type: logType.Register,
        user,
        description: `User ${user.email} has registered at ${today}`
      })

      if (!resultLog.success) {
        return resultLog;
      }

      return {
        success: true,
        message: MessageDialog.__('success.auth.register'),
        record: {
          user_id: user.user_id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
        },
      };
    } catch (err: any) {
      return this.setupErrorMessage(err)
    }
  }

  /** Forgot Password */
  async forgotPassword(email: string): Promise<I_ResultService> {
    try {
      const user = await this.userRepo.findOne({ where: { email }, relations: ['role'] });
      if (!user) {
        return {
          success: false,
          message: MessageDialog.__('error.other.emailNotRegistered'),
          record: user,
        };
      }

      const otpCode: string = generateOTPCode();
      const today: Date = new Date(standartDateISO())
      const expiredAt: Date = new Date(today.setMinutes(today.getMinutes() + 1));

      user.reset_token_code = otpCode;
      user.reset_token_expired = expiredAt; // 60 detik
      user.updated_at = today;
      user.updated_by = user.user_id
      await this.userRepo.save(user);

      // Publish Messaget To Send email
      const optionMessage: { [key: string]: any } = {
        user: {
          reset_token_code: otpCode,
          reset_token_expired: formatDateToday('dddd, MMMM D, YYYY h:mm:ss', expiredAt),
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email
        },
        ...optionalEmail.forgotPassword,
        ...optionalEmail.additional
      }

      console.log({ optionMessage })

      await eventPublishMessageToSendEmail(optionMessage)

      return {
        success: true,
        message: MessageDialog.__('success.auth.sendEmailResetPassword'),
        record: { email },
      };
    } catch (err: any) {
      return this.setupErrorMessage(err)
    }
  }

  /** Verified OTP */
  async verifiedOTP(payload: I_RequestVerifiedOTP): Promise<I_ResultService> {
    try {
      const user = await this.userRepo.findOne({ where: { email: payload?.email }, relations: ['role'] });

      if (!user) {
        return {
          success: false,
          message: MessageDialog.__('error.default.notFoundItem', { item: `Email ${payload?.email}` }),
          record: user
        }
      }

      const today: Date = new Date(standartDateISO());
      const minutes: number = getTotalMinutes(user.reset_token_expired, today);

      if (minutes > 1) {
        return {
          success: false,
          message: MessageDialog.__('error.invalid.otpExpired'),
          record: {
            time_today: today,
            token_expired: user.reset_token_expired,
            minutes_different: minutes
          }
        }
      }

      user.reset_token_code = null;
      user.reset_token_expired = null;
      user.updated_at = today;
      user.updated_by = user.user_id;
      await this.userRepo.save(user);

      return {
        success: true,
        message: MessageDialog.__('success.auth.verifiedOTP'),
        record: {
          user_id: user.user_id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name
        }
      }
    } catch (error: any) {
      return this.setupErrorMessage(error)
    }
  }

  /** Refresh Token */
  async refreshToken(payload: I_RequestToken): Promise<I_ResultService> {
    const decoded = verifiedToken(payload.token);

    let user = await this.userRepo.findOne({ where: { user_id: decoded?.user_id }, relations: ['role'] })

    if (!user) {
      return {
        success: false,
        message: MessageDialog.__('error.missing.tokenAuth'),
        record: user,
      };
    }

    const today = new Date(standartDateISO())

    user.email_verification_token = null;
    user.email_verification_token_expired = null;
    user.updated_at = today;
    user.updated_by = user.user_id
    await this.userRepo.save(user);

    const jwtPayload: I_AuthUserPayload = {
      user_id: user.user_id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: {
        role_id: user.role?.role_id,
        role_name: user.role?.role_name,
        role_slug: user.role?.role_slug,
      }
    };

    const token: I_RequestRefreshToken = {
      access_token: generatedToken(jwtPayload),
      refresh_token: generatedToken(jwtPayload, '7d')
    };

    return {
      success: true,
      message: MessageDialog.__('success.auth.refreshToken'),
      record: token,
    };
  }

  async verifyAccount(payload: I_RequestToken): Promise<I_ResultService> {
    const decoded = verifiedToken(payload.token);

    try {
      const user = await this.userRepo.findOne({ where: { user_id: decoded.user_id } });

      if (!user) {
        return {
          success: false,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'user data' }),
          record: { decoded, user },
        };
      }

      const today: Date = new Date(standartDateISO());
      user.is_active = 1;
      user.verified_at = today;
      user.updated_at = today;
      user.updated_by = user.user_id;
      await this.userRepo.save(user);

      return {
        success: true,
        message: MessageDialog.__('success.auth.verifiedAccount'),
        record: {
          user_id: user.user_id,
          first_name: user.first_name,
          last_name: user.last_name,
          is_active: user.is_active,
        },
      };
    } catch (err: any) {
      return this.setupErrorMessage(err)
    }
  }



  async changePassword(payload: I_ResetPassword): Promise<I_ResultService> {
    try {
      const user = await this.userRepo.findOne({ where: { email: payload?.email } });

      if (!user) {
        return {
          success: false,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'User' }),
          record: user,
        };
      }

      const salt = await generateSalt()

      user.password = await hashedPassword(payload.new_password, salt);
      user.salt = salt;
      user.updated_at = new Date(standartDateISO());
      user.updated_by = user.user_id;

      await this.userRepo.save(user);

      return {
        success: true,
        message: MessageDialog.__('success.auth.resetPassword'),
        record: {
          user_id: user.user_id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email
        },
      };
    } catch (err: any) {
      return this.setupErrorMessage(err)
    }
  }

  async getMe(id: string): Promise<I_ResultService> {
    try {
      const row = await this.userRepo.createQueryBuilder('u')
        .leftJoinAndSelect('u.role', 'r', 'r.deleted_at IS NULL')
        .select([
          'u.user_id',
          'u.first_name',
          'u.last_name',
          'u.email',
          'u.phone_number',
          'u.gender',
          'u.photo',
          'u.address',
          'u.job_position',
          'u.created_at',
          'u.start_work_at',
          'u.end_work_at',
          'u.updated_at',
          'r.role_id',
          'r.role_name',
          'r.role_slug'
        ])
        .where('u.user_id = :id', { id })
        .andWhere('u.deleted_at IS NULL')
        .getMany();

      if (!row) {
        return {
          success: false,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'User' }),
          record: row,
        };
      }

      return {
        success: true,
        message: MessageDialog.__('success.auth.userDetailInfo'),
        record: row,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message,
        record: err,
      };
    }
  }

  async getListMenu(payload: Record<string, any>): Promise<I_ResultService> {
    try {
      const user = await this.userRepo.findOne({ where: { user_id: payload.userId }, relations: ['role'] });
      if (!user) {
        return {
          success: false,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'User' }),
          record: user,
        };
      }

      const roleId: any = user.role.role_id;

      const rows = await this.roleModuleAssocRepo.find({
        where: {
          deleted_at: IsNull(),
          role: {
            role_id: roleId
          },
          role_module_access: {
            menu: {
              parent: IsNull()
            }
          },
        },
        relations: [
          'master_module',
          'role_module_access',
          'role',
          'master_module.module_menu',
          'master_module.module_menu.children',
          'master_module.module_menu.children.children',
          'master_module.module_menu.access_menu',
          'master_module.module_menu.children.access_menu',
          'master_module.module_menu.children.children.access_menu',
        ],
        order: {
          master_module: {
            order_number: 'ASC'
          }
        },
        select: {
          module_access_id: true,
          role: {
            role_id: true,
            role_name: true
          },
          master_module: {
            module_id: true,
            module_name: true,
            module_path: true,
            icon: true,
            order_number: true,
            module_menu: selectDetailMenu
          },
        }
      })


      const updatedRows = rows.map((row: any) => {
        if (row.master_module?.icon) {
          row.master_module.icon = makeFullUrlFile(row.master_module.icon, 'master-module')
          if (row?.master_module?.module_menu?.length > 0) {
            row.master_module.module_menu = row.master_module.module_menu.map((x: any) => {
              if (x?.icon) {
                x.icon = makeFullUrlFile(x.icon, 'master-menu')
              }
              return x
            })
          }
        }
        return row;
      });


      return {
        success: true,
        message: 'Get data success',
        record: updatedRows
      }




    } catch (err: any) {
      return this.setupErrorMessage(err)
    }
  }

  async manualChangePassword(userId: string, payload: Record<string, any>): Promise<I_ResultService> {
    try {
      const user = await this.userRepo.findOne({
        where: { user_id: userId, deleted_at: IsNull() }
      })

      console.log({ users: user, userId, payload })

      if (!user) {
        return {
          success: false,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'User' }),
          record: user,
        };
      }

      const salt = await generateSalt();
      const today: Date = new Date(standartDateISO())

      user.password = await hashedPassword(payload.new_password, salt);
      user.salt = salt;
      user.updated_at = today;
      user.password_change_at = today;
      user.updated_by = user.user_id;

      await this.userRepo.save(user);



      return {
        success: true,
        message: MessageDialog.__('success.auth.changePassword'),
        record: {
          user_id: user.user_id,
        },
      };

    } catch (err: any) {
      return this.setupErrorMessage(err)
    }
  }
}

export default AuthRepository;
