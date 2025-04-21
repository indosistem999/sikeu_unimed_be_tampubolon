import { I_RequestCustom, I_ResultService } from "../../../interfaces/app.interface";
import { Response, NextFunction } from 'express'
import { sendErrorResponse } from "../../../lib/utils/response.util";
import { allSchema as sc } from "../../../constanta";
import { MessageDialog } from "../../../lang";

function ensureArray(value: unknown): I_ResultService {
    if (value === undefined || value === null) {
        return {
            success: false,
            message: 'Value is null or undefined',
            record: value
        }
    }

    if (Array.isArray(value)) {
        return {
            success: true,
            message: 'Value is array',
            record: value
        }
    }

    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
                return {
                    success: true,
                    message: 'Value is array',
                    record: parsed
                }
            } else {
                return {
                    success: false,
                    message: 'Value is string. Parsed string is not an array',
                    record: value
                }
            }
        } catch (err: any) {
            return {
                success: false,
                message: 'Failed to convert string to array',
                record: err
            }
        }
    }

    return {
        success: false,
        message: 'Value is not an array or a valid array string',
        record: value
    }
}


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