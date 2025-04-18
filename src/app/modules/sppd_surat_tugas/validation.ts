import { Response, NextFunction } from 'express';
import { sendErrorResponse } from '../../../lib/utils/response.util';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import { MessageDialog } from '../../../lang';
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { DTO_ValidationCreate, DTO_ValidationUpdate } from './dto';

class SppdSuratTugasValidation {
    async paramValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        if (!req?.params?.surat_tugas_id) {
            sendErrorResponse(
                res,
                422,
                MessageDialog.__('error.missing.requiredEntry', { label: 'Surat tugas id' }),
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
            next();
        }
    }

    async updateValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        const dtoInstance = plainToInstance(DTO_ValidationUpdate, req.body);
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
            next();
        }
    }

    async uploadUndanganValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        if (!req?.file) {
            sendErrorResponse(
                res,
                422,
                MessageDialog.__('error.missing.fileUpload', { label: 'Undangan' }),
                null
            );
        } else {
            next();
        }
    }
}

export default new SppdSuratTugasValidation(); 