import { I_RequestCustom } from "../../../interfaces/app.interface";
import { Response, NextFunction } from 'express'
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { sendErrorResponse } from "../../../lib/utils/response.util";
import { allSchema as sc } from "../../../constanta";
import { MessageDialog } from "../../../lang";
import AppDataSource from "../../../config/dbconfig";
import { DTO_ValidationCreate, DTO_ValidationUpdate } from "./dto";
import { SPPDPegawai } from "../../../database/models/SPPDPegawai";
import { IsNull, Like, SelectQueryBuilder } from "typeorm";

class SPPDPegawaiValidation {


    async paramValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        if (!req?.params?.[sc.pegawai.primaryKey]) {
            sendErrorResponse(
                res,
                422,
                MessageDialog.__('error.missing.requiredEntry', { label: 'Pegawai id' }),
                null
            );
        }
        else {
            next()
        }

    }

    // Create
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
        else {

            const nik: any = req?.body?.nik || ''
            const nip: any = req?.body?.nip || ''

            const row = await AppDataSource.getRepository(SPPDPegawai)
                .findOne({
                    where: [
                        {
                            nik: Like(`%${nik}%`),
                            deleted_at: IsNull(),
                        },
                        {
                            nip: Like(`%${nip}%`),
                            deleted_at: IsNull()
                        }
                    ]
                })

            if (row) {
                sendErrorResponse(res, 400, MessageDialog.__('error.existed.universal', { item: `Nip (${nip}) or Nik (${nik})` }), { row_existed: row })
            }
            else {
                next()
            }
        }

    }

    // Update
    async updateValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        const id: string = req?.params?.[sc.pegawai.primaryKey]
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

            const nik: any = req?.body?.nik || ''
            const nip: any = req?.body?.nip || ''

            const row = await AppDataSource.getRepository(SPPDPegawai)
                .createQueryBuilder('p')
                .where('p.deleted_at is null')
                .andWhere((builder: SelectQueryBuilder<SPPDPegawai>) => {
                    builder.where(`p.nik LIKE :nik`, { nik: `%${nik}%` })
                        .orWhere(`p.nip LIKE :nip`, { nip: `%${nip}%` })
                })
                .andWhere(
                    `p.${sc.pegawai.primaryKey} != :id`, { id }
                )
                .select([
                    `p.${sc.pegawai.primaryKey}`
                ])
                .getOne()

            if (row) {
                sendErrorResponse(res, 400, MessageDialog.__('error.existed.universal', { item: `Nip (${nip}) or Nik (${nik})` }), { row_existed: row })
            }
            else {
                next();
            }
        }
    }
}

export default new SPPDPegawaiValidation();