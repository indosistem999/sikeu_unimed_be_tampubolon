import { Response, NextFunction } from 'express';
import { sendErrorResponse } from '../../lib/utils/response.util';
import { MessageDialog } from '../../lang';
import { verifiedToken } from '../../lib/utils/jwt.util';
import { I_RequestCustom } from '../../interfaces/app.interface';
import AppDataSource from '../../config/dbconfig';
import { Users } from '../../database/models/Users';

export const authMiddleware = async (req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req?.headers?.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendErrorResponse(res, 401, MessageDialog.__('error.denied.tokenAccess'), authHeader);
  } else {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = verifiedToken(token);

      const user = await AppDataSource.getRepository(Users).findOne({
        where: { user_id: decoded?.user_id }
      });

      if (!user) {
        sendErrorResponse(res, 404, MessageDialog.__('error.default.notFoundItem', { item: 'User' }))
      }

      // Cek apakah password diubah setelah token dibuat
      if (user?.password_change_at && user?.password_change_at != null) {
        const changedTimestamp = Math.floor(user.password_change_at.getTime() / 1000);
        if (decoded?.iat && decoded?.iat < changedTimestamp) {
          sendErrorResponse(res, 400, MessageDialog.__('error.default.changePassword'))
        }
      }

      req.user = decoded
      next();
    } catch (error: any) {
      sendErrorResponse(res, 401, MessageDialog.__('error.invalid.tokenExpired'), error);
    }
  }
};

export const adminAuthMiddleware = async (req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req?.headers?.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendErrorResponse(res, 401, MessageDialog.__('error.denied.tokenAccess'), authHeader);
  } else {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = verifiedToken(token);
      const roleSlug: any = decoded?.role?.role_slug;

      if (['admin', 'developer'].includes(roleSlug)) {
        const user = await AppDataSource.getRepository(Users).findOne({
          where: { user_id: decoded?.user_id }
        });

        if (!user) {
          sendErrorResponse(res, 404, MessageDialog.__('error.default.notFoundItem', { item: 'User' }))
        }

        // Cek apakah password diubah setelah token dibuat
        if (user?.password_change_at && user?.password_change_at != null) {
          const changedTimestamp = Math.floor(user.password_change_at.getTime() / 1000);
          if (decoded?.iat && decoded?.iat < changedTimestamp) {
            sendErrorResponse(res, 400, MessageDialog.__('error.default.changePassword'))
          }
        }

        req.user = decoded
        next()
      } else {
        sendErrorResponse(res, 401, `Access denied for role ${roleSlug}`, null)
      }
    } catch (error: any) {
      sendErrorResponse(res, 401, MessageDialog.__('error.invalid.tokenExpired'), error);
    }
  }
};

