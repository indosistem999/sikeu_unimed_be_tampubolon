import { I_RequestCustom } from "../../../interfaces/app.interface";
import { Response, NextFunction } from 'express'
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { sendErrorResponse } from "../../../lib/utils/response.util";
import { allSchema as sc } from "../../../constanta";
import { MessageDialog } from "../../../lang";
import AppDataSource from "../../../config/dbconfig";
import { DTO_ValidationCreate, DTO_ValidationUpdate } from "./dto";
import { ensureArray } from "../../../lib/utils/common.util";
import { MasterDataOutput } from "../../../database/models/MasterDataOutput";

class MasterDataOutputValidation {


    async paramValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        if (!req?.params?.[sc.master_data_output.primaryKey]) {
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
            const row = await AppDataSource.getRepository(MasterDataOutput)
                .createQueryBuilder('p')
                .where(`p.code LIKE :GR`, { GR: `%${req.body.code || ''}%` })
                .andWhere(`p.deleted_at IS NULL`)
                .select([
                    `p.${sc.master_data_output.primaryKey}`
                ])
                .getOne();

            if (row) {
                sendErrorResponse(res, 400, MessageDialog.__('error.existed.masterDataOutput'), row)
            }
            else {
                next()
            }

        }
    }

    // Update
    async updateValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        const id: string = req?.params?.[sc.master_data_output.primaryKey]
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

            const row = await AppDataSource.getRepository(MasterDataOutput)
                .createQueryBuilder('p')
                .where(`p.code LIKE :GR`, { GR: `%${req.body.code || ''}%` })
                .andWhere(`p.deleted_at IS NULL`)
                .andWhere(
                    `p.${sc.master_data_output.primaryKey} != :id`, { id }
                )
                .select([
                    `p.${sc.master_data_output.primaryKey}`
                ])
                .getOne()

            if (row) {
                sendErrorResponse(
                    res,
                    422,
                    MessageDialog.__('error.existed.universal'),
                    { item: `Code output ${req?.body?.code}` }
                );
            }
            else {
                next();
            }

        }
    }


    // Batch Delete
    async batchDeleteValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        const result = ensureArray(req?.body?.list_output)

        if (!result?.success) {
            sendErrorResponse(res, 400, result.message, result.record)
        }
        else {
            if (req?.body?.list_output?.length <= 0) {
                sendErrorResponse(res, 400, MessageDialog.__('error.default.emptyData', { item: 'List output id' }), req?.body?.list_output)
            }
            else {
                next()
            }
        }
    }
}

export default new MasterDataOutputValidation();