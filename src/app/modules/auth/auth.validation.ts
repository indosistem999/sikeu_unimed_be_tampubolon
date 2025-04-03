import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import {
  DTO_ValidationForgotPassword,
  DTO_ValidationLogin,
  DTO_ValidationRegister,
  DTO_ValidationVerifyOTP,
} from './auth.dto';
import { sendErrorResponse } from '../../../lib/utils/response.util';

export default new (class AuthValidation {
  async loginValidation(req: Request, res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToClass(DTO_ValidationLogin, req?.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      sendErrorResponse(
        res,
        400,
        errors
          .map((err) => Object.values(err.constraints!))
          .flat()
          .toString(),
        errors
      );
    }

    next();
  }

  async registerValidation(req: Request, res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToClass(DTO_ValidationRegister, req?.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      sendErrorResponse(
        res,
        400,
        errors
          .map((err) => Object.values(err.constraints!))
          .flat()
          .toString(),
        errors
      );
    }

    next();
  }

  async forgotPasswordValidation(req: Request, res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToClass(DTO_ValidationForgotPassword, req?.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      sendErrorResponse(
        res,
        400,
        errors
          .map((err) => {
            console.log({err})
            return Object.values(err.constraints!).join(', ')
          })
          .flat()
          .toString(),
        errors
      );
    }

    next();
  }

  async verifyOTPValidation(req: Request, res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToClass(DTO_ValidationVerifyOTP, req?.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      sendErrorResponse(
        res,
        400,
        errors
          .map((err) => {
            console.log({err})
            return Object.values(err.constraints!).join(', ')
          })
          .flat()
          .toString(),
        errors
      );
    }

    next();
  }

})();
