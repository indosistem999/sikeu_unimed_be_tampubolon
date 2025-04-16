import { Request, Response } from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../../../lib/utils/response.util';
import { defineRequestOrderORM, defineRequestPaginateArgs } from '../../../lib/utils/request.util';
import { sortDefault, sortRequest } from './constanta';
import { allSchema as sc } from '../../../constanta'
import { I_UserLogService } from '../../../interfaces/userLog.interface';
import UserLogRepository from './repository';
import { I_RequestCustom } from '../../../interfaces/app.interface';

class UserLogService implements I_UserLogService {
    private readonly repository = new UserLogRepository();

    /** Fetch Data */
    async fetch(req: I_RequestCustom, res: Response): Promise<Response> {
        const filters: Record<string, any> = {
            paging: defineRequestPaginateArgs(req),
            sorting: defineRequestOrderORM(req, sortDefault, sortRequest),
        }

        const result = await this.repository.fetch(req, filters)
        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }
}

export default new UserLogService();
