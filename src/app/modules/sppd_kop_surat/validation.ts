import { Response, NextFunction } from 'express';
import { sendErrorResponse } from '../../../lib/utils/response.util';
import { allSchema as sc } from '../../../constanta';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import { MessageDialog } from '../../../lang';
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { DTO_ValidationCreate, DTO_ValidationUpdate } from './dto';

class KopSuratValidation {
    async paramValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        if (!req?.params?.[sc.kop_surat.primaryKey]) {
            sendErrorResponse(
                res,
                422,
                MessageDialog.__('error.missing.requiredEntry', { label: 'Kop surat id' }),
                null
            );
        }
        else {
            next()
        }
    }

    async createValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        const errors = await validate(plainToInstance(DTO_ValidationCreate, req.body));
        if (errors.length > 0) {
            sendErrorResponse(res, 422, MessageDialog.__('error.validation.default'), errors);
        } else {
            next();
        }
    }

    async createBatchValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        if (!Array.isArray(req.body)) {
            sendErrorResponse(res, 422, MessageDialog.__('error.validation.kopSurat.batchFormat'), null);
            return;
        }

        const errors = await Promise.all(
            req.body.map(async (item) => {
                return await validate(plainToInstance(DTO_ValidationCreate, item));
            })
        );

        const hasErrors = errors.some(error => error.length > 0);
        if (hasErrors) {
            sendErrorResponse(res, 422, MessageDialog.__('error.validation.default'), errors);
        } else {
            next();
        }
    }

    async updateValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        const errors = await validate(plainToInstance(DTO_ValidationUpdate, req.body));
        if (errors.length > 0) {
            sendErrorResponse(res, 422, MessageDialog.__('error.validation.default'), errors);
        } else {
            next();
        }
    }

    async updateBatchValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        if (!Array.isArray(req.body)) {
            sendErrorResponse(res, 422, MessageDialog.__('error.validation.kopSurat.batchFormat'), null);
            return;
        }

        const errors = await Promise.all(
            req.body.map(async (item) => {
                if (!item.kopsurat_id) {
                    return [{
                        property: 'kopsurat_id',
                        constraints: {
                            required: MessageDialog.__('error.missing.requiredEntry', { label: 'Kop surat id' })
                        }
                    }];
                }
                return await validate(plainToInstance(DTO_ValidationUpdate, item));
            })
        );

        const hasErrors = errors.some(error => error.length > 0);
        if (hasErrors) {
            sendErrorResponse(res, 422, MessageDialog.__('error.validation.default'), errors);
        } else {
            next();
        }
    }
}

export default new KopSuratValidation(); 