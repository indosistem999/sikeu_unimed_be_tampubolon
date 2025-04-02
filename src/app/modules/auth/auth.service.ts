import { Request, Response } from 'express';
import {
  I_AuthService,
  I_LoginRequest,
  I_RegisterRequest,
  I_RequestToken,
  I_ResetPassword,
} from '../../../interfaces/auth.interface';
import { sendErrorResponse, sendSuccessResponse } from '../../../lib/utils/response.util';
import AuthRepository from './auth.repository';

export default new (class AuthService implements I_AuthService {
  private readonly authRepo = new AuthRepository();

  async login(req: Request, res: Response): Promise<Response> {
    const payload: I_LoginRequest = req?.body;

    const result = await this.authRepo.signIn(payload);

    if (!result?.success) {
      return sendErrorResponse(res, 400, result.message, result.record);
    }
    return sendSuccessResponse(res, 200, result.message, result.record);
  }

  async register(req: Request, res: Response): Promise<Response> {
    const payload: I_RegisterRequest = req?.body;
    const result = await this.authRepo.signUp(payload);
    return sendSuccessResponse(res, 200, result.message, result.record);
  }

  async refreshToken(req: Request, res: Response): Promise<Response> {
    const payload: I_RequestToken = req?.body;
    const result = await this.authRepo.refreshToken(payload);

    if (!result?.success) {
      return sendErrorResponse(res, 400, result.message, result.record);
    }

    return sendSuccessResponse(res, 200, result.message, result.record);
  }

  async verifyAccount(req: Request, res: Response): Promise<Response> {
    const payload: I_RequestToken = req?.body;
    const result = await this.authRepo.verifyAccount(payload);

    if (!result?.success) {
      return sendErrorResponse(res, 400, result.message, result.record);
    }

    return sendSuccessResponse(res, 200, result.message, result.record);
  }

  async forgotPassword(req: Request, res: Response): Promise<Response> {
    const { email } = req?.body;
    const result = await this.authRepo.forgotPassword(email);

    if (!result?.success) {
      return sendErrorResponse(res, 400, result.message, result.record);
    }

    return sendSuccessResponse(res, 200, result.message, result.record);
  }

  async resetPassword(req: Request, res: Response): Promise<Response> {
    const payload: I_ResetPassword = req?.body;
    const result = await this.authRepo.resetPassword(payload);

    if (!result?.success) {
      return sendErrorResponse(res, 400, result.message, result.record);
    }

    return sendSuccessResponse(res, 200, result.message, result.record);
  }

  async getMe(req: Request, res: Response): Promise<Response> {
    const id: any = '';
    const result = await this.authRepo.getMe(id);

    if (!result?.success) {
      return sendErrorResponse(res, 400, result.message, result.record);
    }

    return sendSuccessResponse(res, 200, result.message, result.record);
  }
})();
