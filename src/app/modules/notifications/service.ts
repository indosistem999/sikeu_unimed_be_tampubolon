import { Request, Response } from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../../../lib/utils/response.util';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import { NotificationRepository } from './repository';
import { allSchema as sc } from '../../../constanta'
import { standartDateISO } from '../../../lib/utils/common.util';

class NotificationService {
    private readonly repository = new NotificationRepository();

    bodyValidation(req: Request): Record<string, any> {
        const payload: Record<string, any> = {};

        if (req?.body?.list_notification) {
            payload.list_notification = req?.body?.list_notification
        }

        return payload;
    }

    async fetch(req: I_RequestCustom, res: Response): Promise<Response> {
        const filters: Record<string, any> = {
            limit: req?.query?.limit || 5
        }

        if (req?.query?.option) {
            filters.option = req?.query?.option
        }

        if (req?.query?.start_date) {
            filters.start_date = req?.query?.start_date
        }

        if (req?.query?.end_date) {
            filters.end_date = req?.query?.end_date
        }

        const result = await this.repository.fetch(req, filters)
        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }

    /** Fetch By Id */
    async fetchById(req: Request, res: Response): Promise<Response> {
        const id: string = req?.params?.[sc.notification.primaryKey]
        const result = await this.repository.fetchById(id)

        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }

    /** Store Identity */
    async setRead(req: I_RequestCustom, res: Response): Promise<Response> {
        const today: Date = new Date(standartDateISO())
        let payload: Record<string, any> = {
            updated_at: today,
            updated_by: req?.user?.user_id,
            ...this.bodyValidation(req),
        }


        const result = await this.repository.setRead(payload);

        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }
}

export default new NotificationService();
