import { Request, Response } from 'express';
import MainRoutes from '../../../config/mainRoute';
import AuthService from './auth.service';
import AuthValidation from './auth.validation';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { I_RequestCustom } from '../../../interfaces/app.interface';

class AuthController extends MainRoutes {
  public routes(): void {
    /** [POST] - Login Account */
    this.router.post(
      '/login',
      async (req: Request, res: Response) => {
        await AuthService.login(req, res)
      }
    );

    /** [POST] - Register New Account */
    this.router.post(
      '/register',
      AuthValidation.registerValidation,
      async (req: Request, res: Response) => {
        await AuthService.register(req, res);
      }
    );

    /** [POST] - Forgot Password */
    this.router.post(
      '/forgot-password',
      AuthValidation.forgotPasswordValidation,
      async (req: Request, res: Response) => {
        await AuthService.forgotPassword(req, res);
      }
    );

    /** [POST] - Refresh Token */
    this.router.get('/refresh-token', authMiddleware, async (req: I_RequestCustom, res: Response) => {
      await AuthService.refreshToken(req, res);
    });

    /** [GET] - Verified Account */
    this.router.get('/verify/:token', async (req: Request, res: Response) => {
      await AuthService.verifyAccount(req, res);
    });

    

    /** [POST] - Reset Password */
    this.router.post('/reset-password', async (req: Request, res: Response) => {
      await AuthService.resetPassword(req, res);
    });

    /** [GET] - Detail User Information */
    this.router.get('/profile', authMiddleware, async (req: I_RequestCustom, res: Response) => {
      await AuthService.getMe(req, res);
    });
  }
}

export default new AuthController().router
