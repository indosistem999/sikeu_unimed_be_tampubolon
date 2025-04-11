import { I_RequestCustom } from "../../../interfaces/app.interface";
import { Response, NextFunction } from 'express'
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { sendErrorResponse } from "../../../lib/utils/response.util";
import { allSchema as sc } from "../../../constanta";
import { MessageDialog } from "../../../lang";
import AppDataSource from "../../../config/dbconfig";
import { DTO_ValidationCreate, DTO_ValidationUpdate } from "./sppdJenisTransportasi.dto";
import { SPPDJenisTransportasi } from "../../../database/models/SPPDJenisTransportasi";

class SPPDJenisTransportasiValidation {


    async paramValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        if (!req?.params?.[sc.sppd_transportation.primaryKey]) {
            sendErrorResponse(
                res,
                422,
                MessageDialog.__('error.missing.requiredEntry', { label: 'Jenis transportasi id' }),
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

        const row = await AppDataSource.getRepository(SPPDJenisTransportasi)
            .createQueryBuilder('p')
            .where(`p.code = :CODE`, { CODE: req?.body?.code })
            .andWhere(`p.name LIKE :NAME`, { NAME: `%${req.body.golongan_angka || ''}%` })
            .andWhere(`p.deleted_at IS NULL`)
            .select(['p.transportation_type_id', 'p.code'])
            .getOne();

        if (row) {
            sendErrorResponse(res, 400, MessageDialog.__('error.existed.universal', { item: `Jenis transportasi ${row?.code}` }), row)
        }

        next()

    }

    async updateValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        const id: string = req?.params?.[sc.sppd_transportation.primaryKey]
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

            const row = await AppDataSource.getRepository(SPPDJenisTransportasi)
                .createQueryBuilder('p')
                .where(`p.code = :CODE`, { CODE: req?.body?.code })
                .andWhere(`p.name LIKE :NAME`, { NAME: `%${req.body.golongan_angka || ''}%` })
                .andWhere(`p.deleted_at IS NULL`)
                .andWhere(
                    'transportation_type_id != :id', { id }
                )
                .select([
                    'p.transportation_type_id',
                    'p.code'
                ])
                .getOne()


            if (row) {
                sendErrorResponse(
                    res,
                    400,
                    MessageDialog.__('error.existed.universal'),
                    { item: `Jenis transportasi ${row?.transportation_type_id} and ${row?.code}` }
                );
            }

            next();
        }
    }
}

export default new SPPDJenisTransportasiValidation();