import { I_RequestCustom } from "../../../interfaces/app.interface";
import { Response, NextFunction } from 'express'
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { DTO_ValidationMasterIdentity } from "./masterMenu.dto";
import { sendErrorResponse } from "../../../lib/utils/response.util";
import { MessageDialog } from "../../../lang";

class MasterIdentityValidation {
  async createMasterIdentityValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToClass(DTO_ValidationMasterIdentity, req?.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      sendErrorResponse(
        res,
        400,
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

  async updateMasterIdentityValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToClass(DTO_ValidationMasterIdentity, req?.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      sendErrorResponse(
        res,
        400,
        errors
          .map((err) => {
            console.log({ err })
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

export default new MasterIdentityValidation();