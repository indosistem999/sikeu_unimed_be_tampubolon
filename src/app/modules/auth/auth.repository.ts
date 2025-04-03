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
} from '../../../interfaces/auth.interface';
import { MessageDialog } from '../../../lang';
import { comparedPasswordBySalt, encryptPassword, generateSalt, hashedPassword } from '../../../lib/utils/bcrypt.util';
import { standartDateISO } from '../../../lib/utils/common.util';
import { generatedToken, verifiedToken } from '../../../lib/utils/jwt.util';
import UserLogRepository from '../userlog/userLog.repository'
import {LogType as logType} from '../../../constanta'
import RoleRepository from '../role/role.repository';
import { eventPublishMessageToSendEmail } from '../../../events/publishers/email.publisher';
import bcrypt from 'bcrypt';

class AuthRepository implements I_AuthRepository {
  private userRepo = AppDataSource.getRepository(Users);

  private userLogRepository: UserLogRepository;
  private roleRepository: RoleRepository;

  constructor() {
    this.userLogRepository = new UserLogRepository();
    this.roleRepository = new RoleRepository();
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

      const lastLogin = others?.last_login ?? new Date(standartDateISO())
      user.last_login = lastLogin;
      user.last_ip = others?.request_ip,
      user.last_hostname = others?.request_host ?? null 
      user.security_question_answer = payload.security_question_answer;
      user = await this.userRepo.save(user);

      const resultLog = await this.userLogRepository.store({
        activity_time: others.last_login,
        activity_type: logType.Login,
        user,
        description: `User has signed in at ${lastLogin} on IP: ${others?.request_ip}, Hostname: ${others?.request_host}`
      })

      if(!resultLog.success) {
        return resultLog;
      }

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
      const refresh_token = generatedToken(jwtPayload);

      return {
        success: true,
        message: MessageDialog.__('success.auth.login'),
        record: {
          access_token,
          refresh_token,
        },
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message,
        record: err,
      };
    }
  }

  /** Register */
  async signUp(payload: I_RegisterRequest): Promise<I_ResultService> {
    const { first_name, last_name, password, email } = payload;
    const {salt, password_hash} = await encryptPassword(password);

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
        is_active: false,
        role: {...customerRole.record}
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

      if(!resultLog.success) {
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
      return {
        success: false,
        message: err.message,
        record: err,
      };
    }
  }

  /** Forgot Password */
  async forgotPassword(email: string): Promise<I_ResultService> {
    try {
      const user = await this.userRepo.findOne({ where: { email } });
      if (!user) {
        return {
          success: false,
          message: MessageDialog.__('error.other.emailNotRegistered'),
          record: user,
        };
      }

      // Publish Messaget To Send email
      await eventPublishMessageToSendEmail({
        ...user
      })

      return {
        success: true,
        message: MessageDialog.__('success.auth.sendEmailResetPassword'),
        record: { email },
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message,
        record: err,
      };
    }
  }

  /** Refresh Token */
  async refreshToken(payload: I_RequestToken): Promise<I_ResultService> {
    const decoded = verifiedToken(payload.token);

    let user = await this.userRepo.findOne({where: {user_id: decoded?.user_id}, relations: ['role']})

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
      refresh_token: generatedToken(jwtPayload),
    };

    console.log({token})

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
      user.is_active = true;
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
      return {
        success: false,
        message: err.message,
        record: err,
      };
    }
  }

  

  async resetPassword(payload: I_ResetPassword): Promise<I_ResultService> {
    const decoded = verifiedToken(payload.token);

    try {
      const user = await this.userRepo.findOne({ where: { user_id: decoded?.user_id } });

      if (!user) {
        return {
          success: false,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'User' }),
          record: user,
        };
      }

      const salt = user?.salt !== null ? user?.salt : await generateSalt()

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
      return {
        success: false,
        message: err.message,
        record: err,
      };
    }
  }

  async getMe(id: string): Promise<I_ResultService> {
    try {
      const user = await this.userRepo.findOne({ where: { user_id: id }, relations: ['role'] });
      if (!user) {
        return {
          success: false,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'User' }),
          record: user,
        };
      }

      console.log({user})

      return {
        success: true,
        message: MessageDialog.__('success.auth.userDetailInfo'),
        record: {
          user_id: user.user_id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: {
            role_id: user?.role?.role_id,
            role_name: user?.role?.role_name,
            role_slug: user?.role?.role_slug
          },
          // modules: user.role.role_modules.map((item) => ({...item.master_module})),
        },
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message,
        record: err,
      };
    }
  }
}

export default AuthRepository;
