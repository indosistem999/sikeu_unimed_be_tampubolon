import { Request, Response } from "express";
import { I_MasterModuleService } from "../../../interfaces/masterModule.interface";
import MasterModuleRepository from "./repository";
import { I_RequestCustom } from "../../../interfaces/app.interface";
import { sendErrorResponse, sendSuccessResponse } from "../../../lib/utils/response.util";
import { getBaseUrl, getHostProtocol, standartDateISO } from "../../../lib/utils/common.util";
import { defineRequestOrder } from "../../../lib/utils/request.util";
import { propSchema, sortDefault, sortRequest } from "./constanta";
import path from "path";
import { getFileFromStorage } from "../../../config/storages";


class MasterModuleService implements I_MasterModuleService {
    private readonly repository = new MasterModuleRepository();


    /** Create New Module */
    async store(req: I_RequestCustom, res: Response): Promise<Response> {

        const fileName = req?.file ? req?.file?.filename : null

        const payload: Record<string, any> = {
            module_name: req?.body?.module_name,
            module_path: req?.body?.module_path,
            order_number: req?.body?.order_number,
            icon: fileName !== null ? path.join('icon', fileName) : null,
            created_at: new Date(standartDateISO()),
            created_by: req?.user?.user_id
        };


        const result = await this.repository.store(req, payload)
        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }

    /** Fetch All Module */
    async fetchAll(req: Request, res: Response): Promise<Response> {

        const filters: Record<string, any> = {
            sorting: defineRequestOrder(req, sortDefault, sortRequest),
            search: (req?.query?.search as string) || null,
            base_url: getBaseUrl(req, 'master-module')
        }

        console.log({ filters })

        const result = await this.repository.fetchAll(filters)
        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }

    /** Fetch By Id */
    async fetchById(req: Request, res: Response): Promise<Response> {
        const id: string = req?.params?.[propSchema.primaryKey]
        const result = await this.repository.fetchById(id)
        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }

    /** Soft Delete */
    async softDelete(req: I_RequestCustom, res: Response): Promise<Response> {
        const payload: Record<string, any> = {
            deleted_at: new Date(standartDateISO()),
            deleted_by: req?.user?.user_id
        }

        const result = await this.repository.softDelete(req, req?.params?.[propSchema.primaryKey], payload)
        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }

    /** Update  */
    async update(req: I_RequestCustom, res: Response): Promise<Response> {
        const id: string = req?.params?.module_id
        let payload: Record<string, any> = {
            module_name: req?.body?.module_name,
            module_path: req?.body?.module_path,
            order_number: req?.body?.order_number,
            updated_at: new Date(standartDateISO()),
            updated_by: req?.user?.user_id
        };

        if (req?.file) {
            const fileName = req?.file ? req?.file?.filename : null
            payload = {
                ...payload,
                icon: fileName !== null ? path.join('icon', fileName) : null,
            }
        }

        const result = await this.repository.update(req, id, payload)
        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }

}

export default new MasterModuleService();