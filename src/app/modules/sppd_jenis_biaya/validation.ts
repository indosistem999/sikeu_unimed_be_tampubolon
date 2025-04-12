import { I_RequestCustom } from "../../../interfaces/app.interface";
import { Response, NextFunction } from 'express'
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { sendErrorResponse } from "../../../lib/utils/response.util";
import { allSchema as sc } from "../../../constanta";
import { MessageDialog } from "../../../lang";
import AppDataSource from "../../../config/dbconfig";
import { DTO_ValidationCreate, DTO_ValidationUpdate } from "./dto";
import { SPPDJenisBiaya } from "../../../database/models/SPPDJenisBiaya";
import { SelectQueryBuilder } from "typeorm";

class SPPDJenisBiayaValidation {


    async paramValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        if (!req?.params?.[sc.sppd_cost.primaryKey]) {
            sendErrorResponse(
                res,
                422,
                MessageDialog.__('error.missing.requiredEntry', { label: 'Jenis biaya id' }),
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

        const code: string = req?.body?.code || ''
        const name: string = req?.body?.name || ''

        const row = await AppDataSource.getRepository(SPPDJenisBiaya)
            .createQueryBuilder('p')
            .where(`p.deleted_at IS NULL`)
            .andWhere((builder: SelectQueryBuilder<SPPDJenisBiaya>) => {
                builder.where(`p.code = :CODE`, { CODE: code })
                    .orWhere(`p.name LIKE :NAME`, { NAME: `%${name}%` })
            })
            .select([`p.${sc.sppd_cost.primaryKey}`, 'p.code', 'p.name'])
            .getOne();

        if (row) {
            sendErrorResponse(res, 400, MessageDialog.__('error.existed.universal', { item: `Code: ${code} or Name: ${name}` }), { row_existed: row })
        }

        next()

    }

    async updateValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        const id: string = req?.params?.[sc.sppd_cost.primaryKey]
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

            const code: string = req?.body?.code || ''
            const name: string = req?.body?.name || ''

            const row = await AppDataSource.getRepository(SPPDJenisBiaya)
                .createQueryBuilder('p')
                .where(`p.deleted_at IS NULL`)
                .andWhere((builder: SelectQueryBuilder<SPPDJenisBiaya>) => {
                    builder.where(`p.code = :CODE`, { CODE: code })
                        .orWhere(`p.name LIKE :NAME`, { NAME: `%${name}%` })
                })
                .andWhere(
                    `p.${sc.sppd_cost.primaryKey} != :id`, { id }
                )
                .select([
                    `p.${sc.sppd_cost.primaryKey}`,
                    'p.code',
                    'p.name'
                ])
                .getOne()


            if (row) {
                sendErrorResponse(res, 400, MessageDialog.__('error.existed.universal', { item: `Code: ${code} or Name: ${name}` }), { row_existed: row })
            }

            next();
        }
    }
}

export default new SPPDJenisBiayaValidation();