import { Request, Response } from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../../../lib/utils/response.util';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import { defineRequestOrderORM, defineRequestPaginateArgs } from '../../../lib/utils/request.util';
import { sortDefault, sortRequest } from './constanta';
import { I_BagianSuratService } from '../../../interfaces/bagianSurat.interface';
import { BagianSuratRepository } from './repository';
import { allSchema as sc } from '../../../constanta';
import { MessageDialog } from '../../../lang';

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

    async fetch(req: Request, res: Response): Promise<Response> {
        try {
            const filters = {
                paging: defineRequestPaginateArgs(req),
                sorting: defineRequestOrderORM(req, sortDefault, sortRequest)
            };
            const result = await this.repository.fetch(filters);

            if (!result.success) {
                return sendErrorResponse(res, 400, result.message, result.record);
            }

            return sendSuccessResponse(res, 200, MessageDialog.__('success.sppdBagianSurat.fetch'), result.record);
        } catch (error) {
            return sendErrorResponse(res, 500, MessageDialog.__('error.failed.storeBagianSurat'), error);
        }
    }

    async store(req: Request, res: Response): Promise<Response> {
        try {
            const payload = this.bodyValidation(req);
            const result = await this.repository.store(payload);

            if (!result.success) {
                return sendErrorResponse(res, 400, result.message, result.record);
            }

            return sendSuccessResponse(res, 200, MessageDialog.__('success.sppdBagianSurat.store'), result.record);
        } catch (error) {
            return sendErrorResponse(res, 500, MessageDialog.__('error.failed.storeBagianSurat'), error);
        }
    }

    async fetchById(req: Request, res: Response): Promise<Response> {
        try {
            const result = await this.repository.fetchById(req?.params?.[sc.bagian_surat.primaryKey]);

            if (!result.success) {
                return sendErrorResponse(res, 404, result.message, result.record);
            }

            return sendSuccessResponse(res, 200, MessageDialog.__('success.sppdBagianSurat.findItem', { item: result.record.bagian_surat_id }), result.record);
        } catch (error) {
            return sendErrorResponse(res, 500, MessageDialog.__('error.failed.storeBagianSurat'), error);
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        try {
            const payload = this.bodyValidation(req);
            const result = await this.repository.update(req?.params?.[sc.bagian_surat.primaryKey], payload);

            if (!result.success) {
                return sendErrorResponse(res, 404, result.message, result.record);
            }

            return sendSuccessResponse(res, 200, MessageDialog.__('success.sppdBagianSurat.update'), result.record);
        } catch (error) {
            return sendErrorResponse(res, 500, MessageDialog.__('error.failed.storeBagianSurat'), error);
        }
    }

    async softDelete(req: Request, res: Response): Promise<Response> {
        try {
            const result = await this.repository.softDelete(req?.params?.[sc.bagian_surat.primaryKey], {
                deleted_at: new Date(),
                deleted_by: (req as I_RequestCustom)?.user?.user_id
            });

            if (!result.success) {
                return sendErrorResponse(res, 404, result.message, result.record);
            }

            return sendSuccessResponse(res, 200, MessageDialog.__('success.sppdBagianSurat.softDelete'), result.record);
        } catch (error) {
            return sendErrorResponse(res, 500, MessageDialog.__('error.failed.storeBagianSurat'), error);
        }
    }
}

export default new BagianSuratService(); 