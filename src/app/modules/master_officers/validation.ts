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
import { IsNull, SelectQueryBuilder } from "typeorm";
import { MasterOfficers } from "../../../database/models/MasterOfficers";
import { PositionType } from "../../../interfaces/enum.interface";

class MasterOfficerValidation {


    async paramValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        if (!req?.params?.[sc.master_officers.primaryKey]) {
            sendErrorResponse(
                res,
                422,
                MessageDialog.__('error.missing.requiredEntry', { label: 'Officer id' }),
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


        if (req?.body?.position_type && req?.body?.position_type == PositionType.SATKER) {
            if (!req?.body?.unit_id) {
                sendErrorResponse(
                    res,
                    422,
                    MessageDialog.__('error.missing.requiredEntry', { label: 'Unit id' }),
                    req.body
                );
            }
        }


        const row = await AppDataSource.getRepository(MasterOfficers)
            .findOne({
                where: {
                    deleted_at: IsNull(),
                    nip: req?.body?.nip
                }
            })

        if (row) {
            sendErrorResponse(res, 400, MessageDialog.__('error.existed.universal', { item: `Officer with NIP ${req?.body?.nip}` }), { row_existed: row })
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

            const row = await AppDataSource.getRepository(MasterOfficers)
                .createQueryBuilder('p')
                .where(`p.deleted_at IS NULL`)
                .andWhere(
                    `p.nip = :nip`, { nip: req?.body?.nip }
                )
                .andWhere(
                    `p.${sc.master_officers.primaryKey} != :id`, { id }
                )
                .select([
                    `p.${sc.master_officers.primaryKey}`,
                    'p.nip',
                    'p.full_name'
                ])
                .getOne()


            if (row) {
                sendErrorResponse(res, 400, MessageDialog.__('error.existed.universal', { item: `Nip ${req?.body?.nip}` }), { row_existed: row })
            }

            next();
        }
    }

}

export default new MasterOfficerValidation();