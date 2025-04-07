import { I_RequestCustom } from "../../../interfaces/app.interface";
import { Response, NextFunction } from 'express'
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { sendErrorResponse } from "../../../lib/utils/response.util";
import { DTO_ValidationWorkUnitCreate, DTO_ValidationWorkUnitUpdate } from "./workUnit.dto";
import { workUnitSchema } from "./workUnit.constanta";
import { MessageDialog } from "../../../lang";
import AppDataSource from "../../../config/dbconfig";
import { MasterWorkUnit } from "../../../database/models/MasterWorkUnit";

class WorkUnitValidation {


    async paramValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        if (!req?.params?.[workUnitSchema.primaryKey]) {
            sendErrorResponse(
                res,
                422,
                MessageDialog.__('error.missing.requiredEntry', { label: 'Work unit id' }),
                null
            );
        }
        else {
            next()
        }

    }

    async createValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        const dtoInstance = plainToClass(DTO_ValidationWorkUnitCreate, req?.body);
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
            const unitCode: string = req?.body?.unit_code?.toLowerCase();
            const unitType: string = req?.body?.unit_type?.toLowerCase();

            const rows = await AppDataSource.getRepository(MasterWorkUnit)
                .createQueryBuilder(`${workUnitSchema.tableName}`)
                .where('deleted_at IS NULL')
                .andWhere(
                    'LOWER(unit_code) = :unitCode OR LOWER(unit_type) = :unitType',
                    { unitCode, unitType }
                )
                .getOne()


            if (rows) {
                sendErrorResponse(
                    res,
                    422,
                    MessageDialog.__('error.existed.workUnit', { item: `unit code ${unitCode} or unit type ${unitType}` }),
                    { data_existed: rows }
                );
            }
            else {
                next()
            }
        }

    }

    async updateValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        const unit_id: string = req?.params?.unit_id
        const dtoInstance = plainToInstance(DTO_ValidationWorkUnitUpdate, req.body);
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
            const unitCode: string = req?.body?.unit_code ? req?.body?.unit_code?.toLowerCase() : null;
            const unitType: string = req?.body?.unit_type ? req?.body?.unit_type?.toLowerCase() : null;

            const queryBuilder = AppDataSource.getRepository(MasterWorkUnit)
                .createQueryBuilder(`${workUnitSchema.tableName}`)
                .where('deleted_at IS NULL')

            if (unitCode != null && unitType != null) {
                queryBuilder.andWhere(
                    'LOWER(unit_code) = :unitCode OR LOWER(unit_type) = :unitType',
                    { unitCode, unitType }
                )
            }
            else {
                if (unitCode != null) {
                    queryBuilder.andWhere(
                        'LOWER(unit_code) = :unitCode',
                        { unitCode }
                    )
                }
                else {
                    queryBuilder.andWhere(
                        'LOWER(unit_type) = :unitType',
                        { unitType }
                    )
                }
            }

            const row = await queryBuilder
                .andWhere(
                    'unit_id != :unit_id', { unit_id }
                )
                .getOne()


            if (row) {
                sendErrorResponse(
                    res,
                    422,
                    MessageDialog.__('error.existed.workUnit', { item: `unit code ${unitCode} or unit type ${unitType}` }),
                    { data_existed: row }
                );
            }

            next();
        }
    }
}

export default new WorkUnitValidation();