import { I_RequestCustom } from "../../../interfaces/app.interface";
import { Response, NextFunction } from 'express'
import { sendErrorResponse } from "../../../lib/utils/response.util";
import { allSchema as sc } from "../../../constanta";
import { MessageDialog } from "../../../lang";

class PejabatSatkerValidation {
    async paramValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        if (!req?.params?.[sc.work_unit.primaryKey]) {
            sendErrorResponse(
                res,
                422,
                MessageDialog.__('error.missing.requiredEntry', { label: 'Unit id' }),
                null
            );
        }
        else {
            next()
        }

    }

}

export default new PejabatSatkerValidation();