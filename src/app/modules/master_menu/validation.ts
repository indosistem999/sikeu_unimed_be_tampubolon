import { I_RequestCustom } from "../../../interfaces/app.interface";
import { Response, NextFunction } from 'express'
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { DTO_ValidationMenuCreate, DTO_ValidationMenuUpdate } from "./dto";
import { sendErrorResponse } from "../../../lib/utils/response.util";
import { MessageDialog } from "../../../lang";
import { allSchema as sc } from '../../../constanta'

class MasterMenuValidation {

  async paramValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
    if (!req?.params?.[sc.menu.primaryKey]) {
      sendErrorResponse(
        res,
        422,
        MessageDialog.__('error.missing.requiredEntry', { label: 'Menu id' }),
        null
      );
    }
    else {
      next()
    }

  }

  async createValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToClass(DTO_ValidationMenuCreate, req?.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      sendErrorResponse(
        res,
        422,
        errors
          .map((err) => {
            return Object.values(err.constraints!).join(', ')
          })
          .flat()
          .toString(),
        errors
      );
    }

    next();
  }

  async updateValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToClass(DTO_ValidationMenuUpdate, req?.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      sendErrorResponse(
        res,
        422,
        errors
          .map((err) => {
            return Object.values(err.constraints!).join(', ')
          })
          .flat()
          .toString(),
        errors
      );
    }

    next();
  }
}



export default new MasterMenuValidation();