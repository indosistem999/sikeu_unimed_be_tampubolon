import { I_RequestCustom } from "../../../interfaces/app.interface";
import { Response, NextFunction } from 'express'
import { sendErrorResponse } from "../../../lib/utils/response.util";
import { allSchema as sc } from "../../../constanta";
import { MessageDialog } from "../../../lang";
import { ensureArray } from "../../../lib/utils/common.util";

class NotificationValidation {
    async paramValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        if (!req?.params?.[sc.notification.primaryKey]) {
            sendErrorResponse(
                res,
                422,
                MessageDialog.__('error.missing.requiredEntry', { label: 'Notification id' }),
                null
            );
        }
        else {
            next()
        }

    }

    // Create
    async setReadValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        const result = ensureArray(req?.body?.list_notification)

        if (!result?.success) {
            sendErrorResponse(res, 400, result.message, result.record)
        }
        else {
            next()
        }
    }

}

export default new NotificationValidation();