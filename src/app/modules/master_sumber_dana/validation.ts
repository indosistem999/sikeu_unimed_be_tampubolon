import { I_RequestCustom } from "../../../interfaces/app.interface";
import { Response, NextFunction } from 'express'
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { sendErrorResponse } from "../../../lib/utils/response.util";
import { allSchema as sc } from "../../../constanta";
import { MessageDialog } from "../../../lang";
import AppDataSource from "../../../config/dbconfig";
import { DTO_ValidationCreate, DTO_ValidationUpdate } from "./dto";
import { MasterSumberDana } from "../../../database/models/MasterSumberDana";
import { SelectQueryBuilder } from "typeorm";

class MasterSumberDanaValidation {

  async paramValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
    if (!req?.params?.[sc.sumber_dana.primaryKey]) {
      sendErrorResponse(
        res,
        422,
        MessageDialog.__('error.missing.requiredEntry', { label: 'Source of funds id' }),
        null
      );
    }
    else {
      next()
    }
  }

  async createValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToClass(DTO_ValidationCreate, req?.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      sendErrorResponse(
        res,
        422,
        errors.map((err: any) => {
          return Object.values(err.constraints!).join(', ')
        }).flat().toString(),
        errors
      );
    }

    const row = await AppDataSource.getRepository(MasterSumberDana)
      .createQueryBuilder('p')
      .where(`p.deleted_at IS NULL`)
      .andWhere(`p.code = :value`, { value: req?.body?.code })
      .select([`p.${sc.sumber_dana.primaryKey}`, 'p.code', 'p.description'])
      .getOne();

    if (row) {
      sendErrorResponse(res, 400, MessageDialog.__('error.existed.universal', { item: `Source of code ${req?.body?.code}` }), { row_existed: row })
    }

    next()
  }

  async updateValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
    const id: string = req?.params?.[sc.sumber_dana.primaryKey]
    const dtoInstance = plainToInstance(DTO_ValidationUpdate, req.body);
    (dtoInstance as any).req = req;

    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      sendErrorResponse(
        res,
        422,
        errors
          .map((err: any) => {
            return Object.values(err.constraints!).join(', ')
          })
          .flat()
          .toString(),
        errors
      );
    }
    else {
      const row = await AppDataSource.getRepository(MasterSumberDana)
        .createQueryBuilder('p')
        .where(`p.deleted_at IS NULL`)
        .andWhere(`p.code = :value`, { value: req?.body?.code })
        .andWhere(`p.${sc.sumber_dana.primaryKey} != :id`, { id })
        .select([
          `p.${sc.sumber_dana.primaryKey}`,
          'p.code',
          'p.description'
        ])
        .getOne()

      if (row) {
        sendErrorResponse(res, 400, MessageDialog.__('error.existed.universal', { item: `Source of funds code: ${req?.body?.code}` }), { row_existed: row })
      }

      next();
    }
  }
}

export default new MasterSumberDanaValidation();