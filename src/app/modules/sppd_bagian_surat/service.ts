import { Request, Response } from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../../../lib/utils/response.util';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import { standartDateISO } from '../../../lib/utils/common.util';
import { defineRequestOrderORM, defineRequestPaginateArgs } from '../../../lib/utils/request.util';
import { sortDefault, sortRequest } from './constanta';
import { I_BagianSuratService } from '../../../interfaces/bagianSurat.interface';
import { BagianSuratRepository } from './repository';

class BagianSuratService implements I_BagianSuratService {
    private readonly repository = new BagianSuratRepository();

    bodyValidation(req: Request): Record<string, any> {
        const payload: Record<string, any> = {};

        if (req?.body?.name) {
            payload.name = req?.body?.name
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
        const id: string = req?.params?.bagian_surat_id
        const result = await this.repository.fetchById(id)

        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }

    /** Store Data */
    async store(req: I_RequestCustom, res: Response): Promise<Response> {
        const today: Date = new Date(standartDateISO())
        let payload: Record<string, any> = {
            created_at: today,
            created_by: req?.user?.user_id,
            ...this.bodyValidation(req)
        }

        const result = await this.repository.store(payload)
        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }

    /** Update Data */
    async update(req: I_RequestCustom, res: Response): Promise<Response> {
        const today: Date = new Date(standartDateISO())
        const id: string = req?.params?.bagian_surat_id;
        let payload: Record<string, any> = {
            updated_at: today,
            updated_by: req?.user?.user_id,
            ...this.bodyValidation(req)
        }

        const result = await this.repository.update(id, payload)
        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }

    /** Soft Delete By Id */
    async softDelete(req: I_RequestCustom, res: Response): Promise<Response> {
        const today: Date = new Date(standartDateISO())
        const id: string = req?.params?.bagian_surat_id;
        let payload: Record<string, any> = {
            deleted_at: today,
            deleted_by: req?.user?.user_id
        }

        const result = await this.repository.softDelete(id, payload)
        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }
}

export default new BagianSuratService(); 