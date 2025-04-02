import { AppDataSource } from '../../../config/database';
import { Role } from '../../../database/models/roles';
import { User } from '../../../database/models/users';
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
import { comparedPassword, hashedPassword } from '../../../lib/utils/bcrypt.util';
import { standartDateISO } from '../../../lib/utils/common.util';
import { generatedToken, verifiedToken } from '../../../lib/utils/jwt.util';

class AuthRepository implements I_AuthRepository {
  private userRepo = AppDataSource.getRepository(User);
  private roleRepo = AppDataSource.getRepository(Role);

  async signIn(payload: I_LoginRequest): Promise<I_ResultService> {
    try {
      let user = await this.userRepo.findOne({
        where: {
          email: payload.email,
        },
        relations: ['roles'],
      });

      if (!user) {
        return {
          success: false,
          message: MessageDialog.__('error.invalid.emailEntry'),
          record: user,
        };
      }

      if (await comparedPassword(payload.password, user.password)) {
        return {
          success: false,
          message: MessageDialog.__('error.invalid.password'),
          record: user,
        };
      }

      const today: Date = new Date(standartDateISO());

      user.last_login = today;
      user = await this.userRepo.save(user);

      const jwtPayload: I_AuthUserPayload = {
        user_id: user.user_id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        roles: user.roles.map((item) => ({
          role_id: item.role?.role_id,
          role_name: item.role?.role_name,
          role_slug: item.role?.role_slug,
        })),
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

  async signUp(payload: I_RegisterRequest): Promise<I_ResultService> {
    const { first_name, last_name, password, email } = payload;
    const hash = await hashedPassword(password);

    try {
      const customerRole = await this.roleRepo.findOne({ where: { role_name: 'customer' } });

      if (!customerRole) {
        return {
          success: false,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'Customer role' }),
          record: customerRole,
        };
      }

      const user = await this.userRepo.save(
        this.userRepo.create({
          first_name,
          last_name,
          email,
          password: hash,
          registered_date: new Date(standartDateISO()),
          roles: [customerRole],
          is_active: false,
        })
      );

      if (!user) {
        return {
          success: false,
          message: MessageDialog.__('error.failed.registerAccount'),
          record: user,
        };
      }

      return {
        success: true,
        message: MessageDialog.__('success.auth.register'),
        record: {
          user_id: user.user_id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.roles,
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

  async refreshToken(payload: I_RequestToken): Promise<I_ResultService> {
    const user = verifiedToken(payload.token);

    if (!user) {
      return {
        success: false,
        message: MessageDialog.__('error.missing.tokenAuth'),
        record: user,
      };
    }

    const token: I_RequestRefreshToken = {
      access_token: generatedToken(user),
      refresh_token: generatedToken(user),
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
      user.is_active = true;
      user.verified_at = today;
      user.updated_at = today;
      user.updated_by = user;
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

      //

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

      user.password = await hashedPassword(payload.new_password);
      user.updated_at = new Date(standartDateISO());
      user.updated_by = user;

      await this.userRepo.save(user);

      return {
        success: true,
        message: MessageDialog.__('success.auth.resetPassword'),
        record: { user },
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
      const user = await this.userRepo.findOne({ where: { user_id: id } });
      if (!user) {
        return {
          success: false,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'User' }),
          record: user,
        };
      }

      return {
        success: true,
        message: MessageDialog.__('success.auth.userDetailInfo'),
        record: {
          user_id: user.user_id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.roles.map((item) => ({
            role_id: item?.role?.role_id,
            role_name: item?.role?.role_name,
            role_slug: item?.role?.role_slug,
          })),
          permissions: user.roles.map((item) => {
            return {
              role_id: item?.role?.role_id,
              role_name: item?.role?.role_name,
              role_slug: item?.role?.role_slug,
              permissions: item?.role?.permissions,
            };
          }),
          menus: user.roles.map((item) => {
            return {
              role_id: item?.role?.role_id,
              role_name: item?.role?.role_name,
              role_slug: item?.role?.role_slug,
              permissions: item?.role?.permissions.map((value) => {
                return {
                  ...value.permission,
                  menus: value.permission?.menus,
                };
              }),
            };
          }),
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
