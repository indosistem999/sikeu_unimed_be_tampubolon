import { Request, Response } from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../../../lib/utils/response.util';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import { standartDateISO } from '../../../lib/utils/common.util';
import { defineRequestOrderORM, defineRequestPaginateArgs } from '../../../lib/utils/request.util';
import { sortDefaultOfficer, sortDefaultUnitWork, sortRequestOfficer, sortRequestUnitWork } from './constanta';
import { allSchema as sc } from '../../../constanta'
import { I_PejabatSatkerService } from '../../../interfaces/pejabatSatker.interface';
import { PejabatSatkerRepository } from './repository';

class PejabatSatkerService implements I_PejabatSatkerService {
    private readonly repository = new PejabatSatkerRepository();



    /** Fetch Data */
    async fetchUnitWorkGroup(req: Request, res: Response): Promise<Response> {
        const filters: Record<string, any> = {
            paging: defineRequestPaginateArgs(req),
            sorting: defineRequestOrderORM(req, sortDefaultUnitWork, sortRequestUnitWork),
        }

        const result = await this.repository.fetchUnitWorkGroup(filters)
        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }

    /** Fetch By Id */
    async fetchOfficerGroup(req: Request, res: Response): Promise<Response> {
        const id: string = req?.params?.[sc.work_unit.primaryKey]
        const queries: Record<string, any> = {};
        if (req?.query?.job_category_id) {
            queries.job_category_id = req?.query?.job_category_id
        }

        if (req?.query?.start_date_position) {
            queries.start_date_position = req?.query?.start_date_position
        }

        if (req?.query?.end_date_position) {
            queries.end_date_position = req?.query?.end_date_position
        }


        const filters: Record<string, any> = {
            paging: defineRequestPaginateArgs(req),
            sorting: defineRequestOrderORM(req, sortDefaultOfficer, sortRequestOfficer),
            queries
        }

        const result = await this.repository.fetchOfficerGroup(id, filters)
        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }
}

export default new PejabatSatkerService();
