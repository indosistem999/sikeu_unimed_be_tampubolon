import { Response } from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../../../lib/utils/response.util';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import { defineRequestOrderORM, defineRequestPaginateArgs } from '../../../lib/utils/request.util';
import { SppdBerandaRepository } from './repository';

class SppdBerandaService {
    private readonly repository = new SppdBerandaRepository();

    /** Fetch Board */
    async fetchBoard(req: I_RequestCustom, res: Response): Promise<Response> {
        const result = await this.repository.fetchBoard(req)
        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }

    /** Fetch Chart */
    async fetchChart(req: I_RequestCustom, res: Response): Promise<Response> {
        const filters: Record<string, any> = {
            start_year: req?.query?.start_year || 2024,
            end_year: req?.query?.end_year || 2025,
            type_name: req?.query?.type_statistic?.toString().toLowerCase() || 'travel_statistics_month',
            unit_id: req?.query?.unit_id
        }


        const result = await this.repository.fetchChart(req, filters)
        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }

}

export default new SppdBerandaService();
