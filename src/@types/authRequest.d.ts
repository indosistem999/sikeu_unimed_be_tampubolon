import { I_AuthUserPayload } from '../interfaces/auth.interface';

declare global {
  namespace Express {
    interface Request {
      /**
       * Decoded JWT payload attached by the authentication middleware.
       */
      user?: I_AuthUserPayload;
    }
  }
}
