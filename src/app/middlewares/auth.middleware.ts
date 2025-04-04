import { Response, NextFunction } from 'express';
import { sendErrorResponse } from '../../lib/utils/response.util';
import { MessageDialog } from '../../lang';
import { verifiedToken } from '../../lib/utils/jwt.util';
import { I_RequestCustom } from '../../interfaces/app.interface';

export const authMiddleware = (req: I_RequestCustom, res: Response, next: NextFunction): void => {
  const authHeader = req?.headers?.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendErrorResponse(res, 401, MessageDialog.__('error.denied.tokenAccess'), authHeader);
  } else {
    const token = authHeader.split(' ')[1];
    try {
      req.user = verifiedToken(token);
      next();
    } catch (error: any) {
      sendErrorResponse(res, 401, MessageDialog.__('error.invalid.tokenExpired'), error);
    }
  }
};

export const adminAuthMiddleware = (req: I_RequestCustom, res: Response, next: NextFunction): void => {
  const authHeader = req?.headers?.authorization;

  console.log({ authHeader })

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendErrorResponse(res, 401, MessageDialog.__('error.denied.tokenAccess'), authHeader);
  } else {
    const token = authHeader.split(' ')[1];
    try {
      req.user = verifiedToken(token);
      const roleSlug: any = req?.user?.role?.role_slug;

      console.log({ userReq: req?.user })

      if (['admin', 'developer'].includes(roleSlug)) {
        next();
      }
      else {
        sendErrorResponse(res, 401, `Access denied for role ${roleSlug}`, null)
      }
    } catch (error: any) {
      sendErrorResponse(res, 401, MessageDialog.__('error.invalid.tokenExpired'), error);
    }
  }
};

