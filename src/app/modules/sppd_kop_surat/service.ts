import { Request, Response } from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../../../lib/utils/response.util';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import { defineRequestOrderORM, defineRequestPaginateArgs } from '../../../lib/utils/request.util';
import { sortDefault, sortRequest } from './constanta';
import { I_KopSuratService } from '../../../interfaces/kopSurat.interface';
import { KopSuratRepository } from './repository';
import { allSchema as sc } from '../../../constanta';
import { MessageDialog } from '../../../lang';

class KopSuratService implements I_KopSuratService {
    private readonly repository = new KopSuratRepository();

    bodyValidation(req: Request): Record<string, any> {
        const payload: Record<string, any> = {};

        if (req?.body?.order_number) {
            payload.order_number = req?.body?.order_number
        }

        if (req?.body?.description) {
            payload.description = req?.body?.description
        }

        if (req?.body?.font_type) {
            payload.font_type = req?.body?.font_type
        }

        if (req?.body?.font_style) {
            payload.font_style = req?.body?.font_style
        }

        if (req?.body?.font_size) {
            payload.font_size = req?.body?.font_size
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

            return sendSuccessResponse(res, 200, MessageDialog.__('success.sppdKopSurat.fetch'), result.record);
        } catch (error) {
            return sendErrorResponse(res, 500, MessageDialog.__('error.failed.storeKopSurat'), error);
        }
    }

    async store(req: Request, res: Response): Promise<Response> {
        try {
            const payload = {
                ...this.bodyValidation(req),
                created_by: (req as I_RequestCustom)?.user?.user_id
            };
            const result = await this.repository.store(payload);

            if (!result.success) {
                return sendErrorResponse(res, 400, result.message, result.record);
            }

            return sendSuccessResponse(res, 200, MessageDialog.__('success.sppdKopSurat.store'), result.record);
        } catch (error) {
            return sendErrorResponse(res, 500, MessageDialog.__('error.failed.storeKopSurat'), error);
        }
    }

    async fetchById(req: Request, res: Response): Promise<Response> {
        try {
            const result = await this.repository.fetchById(req?.params?.[sc.kop_surat.primaryKey]);

            if (!result.success) {
                return sendErrorResponse(res, 404, result.message, result.record);
            }

            return sendSuccessResponse(res, 200, MessageDialog.__('success.sppdKopSurat.findItem', { item: result.record.kopsurat_id }), result.record);
        } catch (error) {
            return sendErrorResponse(res, 500, MessageDialog.__('error.failed.storeKopSurat'), error);
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        try {
            const payload = {
                ...this.bodyValidation(req),
                updated_by: (req as I_RequestCustom)?.user?.user_id,
                updated_at: new Date()
            };
            const result = await this.repository.update(req?.params?.[sc.kop_surat.primaryKey], payload);

            if (!result.success) {
                return sendErrorResponse(res, 404, result.message, result.record);
            }

            return sendSuccessResponse(res, 200, MessageDialog.__('success.sppdKopSurat.update'), result.record);
        } catch (error) {
            return sendErrorResponse(res, 500, MessageDialog.__('error.failed.storeKopSurat'), error);
        }
    }

    async softDelete(req: Request, res: Response): Promise<Response> {
        try {
            const result = await this.repository.softDelete(req?.params?.[sc.kop_surat.primaryKey], {
                deleted_at: new Date(),
                deleted_by: (req as I_RequestCustom)?.user?.user_id
            });

            if (!result.success) {
                return sendErrorResponse(res, 404, result.message, result.record);
            }

            return sendSuccessResponse(res, 200, MessageDialog.__('success.sppdKopSurat.softDelete'), result.record);
        } catch (error) {
            return sendErrorResponse(res, 500, MessageDialog.__('error.failed.storeKopSurat'), error);
        }
    }

    async preview(req: Request, res: Response): Promise<Response> {
        try {
            const result = await this.repository.preview(req?.params?.[sc.kop_surat.primaryKey]);

            if (!result.success) {
                return sendErrorResponse(res, 404, result.message, result.record);
            }

            return sendSuccessResponse(res, 200, MessageDialog.__('success.sppdKopSurat.preview'), result.record);
        } catch (error) {
            return sendErrorResponse(res, 500, MessageDialog.__('error.failed.storeKopSurat'), error);
        }
    }
}

export default new KopSuratService(); 