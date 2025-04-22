import { Request, Response } from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../../../lib/utils/response.util';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import { standartDateISO } from '../../../lib/utils/common.util';
import { MasterDataComponentRepository } from './repository';
import { defineRequestOrderORM, defineRequestPaginateArgs } from '../../../lib/utils/request.util';
import { sortDefault, sortRequest } from './constanta';
import { allSchema as sc } from '../../../constanta'

class MasterDataComponentService {
    private readonly repository = new MasterDataComponentRepository();

    bodyValidation(req: Request): Record<string, any> {
        const payload: Record<string, any> = {};

        if (req?.body?.code) {
            payload.code = req?.body?.code
        }

        if (req?.body?.description) {
            payload.description = req?.body?.description
        }

        return payload;
    }

    /** Fetch Data */
    async fetch(req: Request, res: Response): Promise<Response> {
        const filters: Record<string, any> = {
            paging: defineRequestPaginateArgs(req),
            sorting: defineRequestOrderORM(req, sortDefault, sortRequest),
        }

        const result = await this.repository.fetch(filters)
        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }

    /** Fetch By Id */
    async fetchById(req: Request, res: Response): Promise<Response> {
        const id: string = req?.params?.[sc.master_data_component.primaryKey]
        const result = await this.repository.fetchById(id)

        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }

    /** Store Identity */
    async store(req: I_RequestCustom, res: Response): Promise<Response> {
        const today: Date = new Date(standartDateISO())
        let payload: Record<string, any> = {
            created_at: today,
            created_by: req?.user?.user_id,
            ...this.bodyValidation(req),
        }


        const result = await this.repository.store(req, payload);

        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }

    /** Update By Id */
    async update(req: I_RequestCustom, res: Response): Promise<Response> {
        const today: Date = new Date(standartDateISO())
        const id: string = req?.params?.[sc.master_data_component.primaryKey];
        let payload: Record<string, any> = {
            updated_at: today,
            updated_by: req?.user?.user_id,
            ...this.bodyValidation(req)
        }

        const result = await this.repository.update(req, id, payload)
        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }


    /** Soft Delete By Id */
    async softDelete(req: I_RequestCustom, res: Response): Promise<Response> {
        const today: Date = new Date(standartDateISO())
        const id: string = req?.params?.[sc.master_data_component.primaryKey];
        let payload: Record<string, any> = {
            deleted_at: today,
            deleted_by: req?.user?.user_id,
        }

        const result = await this.repository.softDelete(req, id, payload)
        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }

    async batchDelete(req: I_RequestCustom, res: Response): Promise<Response> {
        const payload: Record<string, any> = {
            deleted_at: new Date(standartDateISO()),
            deleted_by: req?.user?.user_id,
            list_component: req?.body?.list_component
        }

        const result = await this.repository.batchDelete(req, payload)
        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }
}

export default new MasterDataComponentService();
