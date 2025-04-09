import { Request, Response, NextFunction } from 'express';
import { Config as cfg } from '../../constanta';
import { MessageDialog } from '../../lang';
import compression from 'compression';

/** Set Application Compression */
export const setCompression = () => {
  return compression({
    threshold: 0,
    filter: (req: Request, res: Response) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
  });
};

/** Set Application Header Language */
export const setHeaderLanguage = (req: Request, res: Response, next: NextFunction) => {
  if (req?.headers?.lang) {
    const local: string = req?.headers?.lang?.toString();
    MessageDialog.setLocale(local);
  } else {
    MessageDialog.setLocale(cfg.AppLang);
    req.headers.lang = cfg.AppLang;
  }

  next();
};

/** Set Application Header Protection */
export const setHeaderProtection = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Permissions-Policy', cfg.AppPermissionPolicy);
  res.setHeader('X-XSS-Protection', cfg.AppProtection);
  res.setHeader('Content-Security-Policy', cfg.AppContentSecurityPolicy);

  next();
};


