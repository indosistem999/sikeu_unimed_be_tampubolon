import { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';
import { I_ResultService } from './app.interface';

/* Auth Repository Interface */
export interface I_AuthRepository {
  signIn?(req: Request, payload: I_LoginRequest, others: any): Promise<I_ResultService>;
  signUp?(payload: I_RegisterRequest): Promise<I_ResultService>;
  refreshToken?(payload: I_RequestToken): Promise<I_ResultService>;
  verifyAccount?(payload: I_RequestToken): Promise<I_ResultService>;
  forgotPassword?(email: string): Promise<I_ResultService>;
  changePassword?(payload: I_ResetPassword): Promise<I_ResultService>;
  getMe?(id: string): Promise<I_ResultService>;
}

/** Auth Service Interface */
export interface I_AuthService {
  login?(req: Request, res: Response): Promise<Response>;
  register?(req: Request, res: Response): Promise<Response>;
  forgotPassword?(req: Request, res: Response): Promise<Response>;
  verifiedOTP?(req: Request, res: Response): Promise<Response>;
  refreshToken?(req: Request, res: Response): Promise<Response>;
  verifyAccount?(req: Request, res: Response): Promise<Response>;
  changePassword?(req: Request, res: Response): Promise<Response>;
  getMe?(req: Request, res: Response): Promise<Response>;
}

/** Auth User JWT Payload */
export interface I_AuthUserPayload extends JwtPayload {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: any;
}

/** Login Request Interface */
export interface I_LoginRequest {
  email: string;
  password: string;
  security_question_answer: string
  remember_me?: boolean;
}

/** Register Request Interface */
export interface I_RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

/** Token Request Interface */
export interface I_RequestToken {
  token: any;
}

export interface I_RequestVerifiedOTP {
  email: string;
  reset_token_code: string;
}

/**  */
export interface I_RequestRefreshToken {
  access_token: any;
  refresh_token: any;
}

export interface I_ResetPassword {
  email: string;
  new_password: string;
  confirm_password: string;
}

export interface I_AuthUserDetail {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: any[];
  permissions: any[];
  menus: any[];
}
