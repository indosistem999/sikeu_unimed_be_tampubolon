import { Request, Response } from 'express';
import MainRoutes from '../../../config/mainRoute';
import AuthService from './auth.service';
import AuthValidation from './auth.validation';
import { authMiddleware } from '../../middlewares/auth.middleware';

export default new (class AuthController extends MainRoutes {
  public routes(): void {
    /** [POST] - Login Account */
    this.router.post(
      '/sign-in',
      AuthValidation.loginValidation,
      async (req: Request, res: Response) => {
        await AuthService.login(req, res);
      }
    );

    /** [POST] - Register New Account */
    this.router.post(
      '/sign-up',
      AuthValidation.registerValidation,
      async (req: Request, res: Response) => {
        await AuthService.register(req, res);
      }
    );

    /** [POST] - Refresh Token */
    this.router.post('/refresh-token', authMiddleware, async (req: Request, res: Response) => {
      await AuthService.refreshToken(req, res);
    });

    /** [GET] - Verified Account */
    this.router.get('/verify/:token', async (req: Request, res: Response) => {
      await AuthService.verifyAccount(req, res);
    });

    /** [POST] - Forgot Password */
    this.router.post(
      '/forgot-password',
      authMiddleware,
      AuthValidation.forgotPasswordValidation,
      async (req: Request, res: Response) => {
        await AuthService.forgotPassword(req, res);
      }
    );

    /** [POST] - Reset Password */
    this.router.post('/reset-password', async (req: Request, res: Response) => {
      await AuthService.resetPassword(req, res);
    });

    /** [GET] - Detail User Information */
    this.router.get('/info-me', authMiddleware, async (req: Request, res: Response) => {
      await AuthService.getMe(req, res);
    });
  }
})().router;
