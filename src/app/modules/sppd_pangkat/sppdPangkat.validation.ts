import { I_RequestCustom } from "../../../interfaces/app.interface";
import { Response, NextFunction } from 'express'
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { sendErrorResponse } from "../../../lib/utils/response.util";
import { allSchema as sc } from "../../../constanta";
import { MessageDialog } from "../../../lang";
import AppDataSource from "../../../config/dbconfig";
import { DTO_ValidationPangkatCreate, DTO_ValidationWorkPangkatUpdate } from "./sppdPangkat.dto";
import { SPPDPangkat } from "../../../database/models/SPPDPangkat";

class SPDPangkatValidation {


    async paramValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        if (!req?.params?.[sc.spd_pangkat.primaryKey]) {
            sendErrorResponse(
                res,
                422,
                MessageDialog.__('error.missing.requiredEntry', { label: 'Pangkat id' }),
                null
            );
        }
        else {
            next()
        }

    }

    async createValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        const dtoInstance = plainToClass(DTO_ValidationPangkatCreate, req?.body);
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

        const row = await AppDataSource.getRepository(SPPDPangkat)
            .createQueryBuilder('p')
            .where(`p.golongan_romawi LIKE :GR`, { GR: `%${req.body.golongan_romawi || ''}%` })
            .andWhere(`p.golongan_angka LIKE :GA`, { GA: `%${req.body.golongan_angka || ''}%` })
            .andWhere(`p.pangkat LIKE :PP`, { PP: `%${req.body.pangkat || ''}%` })
            .andWhere(`p.deleted_at IS NULL`)
            .select(['p.pangkat_id'])
            .getOne();

        if (row) {
            sendErrorResponse(res, 400, MessageDialog.__('error.existed.spdPangkat'), row)
        }

        next()

    }

    async updateValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        const pangkat_id: string = req?.params?.[sc.spd_pangkat.primaryKey]
        const dtoInstance = plainToInstance(DTO_ValidationWorkPangkatUpdate, req.body);
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

            const row = await AppDataSource.getRepository(SPPDPangkat)
                .createQueryBuilder('p')
                .where(`p.golongan_romawi LIKE :GR`, { GR: `%${req.body.golongan_romawi || ''}%` })
                .andWhere(`p.golongan_angka LIKE :GA`, { GA: `%${req.body.golongan_angka || ''}%` })
                .andWhere(`p.pangkat LIKE :PP`, { PP: `%${req.body.pangkat || ''}%` })
                .andWhere(`p.deleted_at IS NULL`)
                .andWhere(
                    'pangkat_id != :pangkat_id', { pangkat_id }
                )
                .select([
                    'p.pangkat_id'
                ])
                .getOne()

            console.log({ row })


            if (row) {
                sendErrorResponse(
                    res,
                    422,
                    MessageDialog.__('error.existed.spdPangkat'),
                    { data_existed: row }
                );
            }

            next();
        }
    }
}

export default new SPDPangkatValidation();