import { I_RequestCustom } from "../../../interfaces/app.interface";
import { Response, NextFunction } from 'express'
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { DTO_ValidationModule } from "./masterModule.dto";
import { sendErrorResponse } from "../../../lib/utils/response.util";
import { MessageDialog } from "../../../lang";

class MasterModuleValidation {
    async createModuleValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        const dtoInstance = plainToClass(DTO_ValidationModule, req?.body);
        const errors = await validate(dtoInstance);

        if (errors.length > 0) {
            sendErrorResponse(
                res,
                400,
                errors
                    .map((err) => {
                        console.log({ err })
                        return Object.values(err.constraints!).join(', ')
                    })
                    .flat()
                    .toString(),
                errors
            );
        }

        if (!req?.file) {
            sendErrorResponse(res, 400, MessageDialog.__('error.missing.fileUpload'), req.file);
        }

        next();
    }
}

export default new MasterModuleValidation();