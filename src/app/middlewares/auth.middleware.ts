import { Request, Response, NextFunction } from 'express';
import { sendErrorResponse } from '../../lib/utils/response.util';
import { MessageDialog } from '../../lang';
import { verifiedToken } from '../../lib/utils/jwt.util';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
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
