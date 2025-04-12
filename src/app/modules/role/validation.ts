import { I_RequestCustom } from "../../../interfaces/app.interface";
import { Response, NextFunction } from 'express'
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { sendErrorResponse } from "../../../lib/utils/response.util";
import { MessageDialog } from "../../../lang";
import { DTO_ValidationRoleCreate, DTO_ValidationRoleUpdate } from "./dto";
import { allSchema as sc } from '../../../constanta'
import AppDataSource from "../../../config/dbconfig";
import { IsNull, Not } from "typeorm";
import { Roles } from "../../../database/models/Roles";

class RoleValidation {
  async paramValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
    if (!req?.params?.[sc.role.primaryKey]) {
      sendErrorResponse(
        res,
        422,
        MessageDialog.__('error.missing.requiredEntry', { label: 'Role id' }),
        null
      );
    }
    else {
      next()
    }

  }

  async createValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToClass(DTO_ValidationRoleCreate, req?.body);
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

    const dtoInstance = plainToInstance(DTO_ValidationRoleUpdate, req.body);
    (dtoInstance as any).req = req;

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
    else {
      if (req?.body?.role_name) {
        const role_name: string = req?.body?.role_name;

        const row = await AppDataSource.getRepository(Roles).findOne({
          where: {
            deleted_at: IsNull(),
            role_name,
            role_id: Not(req?.params?.[sc.role.primaryKey])
          }
        })

        if (row) {
          sendErrorResponse(
            res,
            422,
            MessageDialog.__('error.existed.hasRegistered', { item: `Role with ${role_name}` }),
            { role_id: row?.role_id, role_name: row?.role_name }
          );
        }
        else {
          next();
        }
      }
      else {
        next()
      }


    }

  }
}

export default new RoleValidation();