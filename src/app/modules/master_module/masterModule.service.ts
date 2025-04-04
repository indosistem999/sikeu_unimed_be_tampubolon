import { Request, Response } from "express";
import { I_MasterModuleService, I_RequestAddModule } from "../../../interfaces/masterModule.interface";
import MasterModuleRepository from "./masterModule.repository";
import { I_RequestCustom } from "../../../interfaces/app.interface";
import { sendErrorResponse, sendSuccessResponse } from "../../../lib/utils/response.util";
import { standartDateISO } from "../../../lib/utils/common.util";
import { defineRequestOrder } from "../../../lib/utils/request.util";
import { propSchema, sortDefault, sortRequest } from "./masterModule.constanta";


class MasterModuleService implements I_MasterModuleService {
    private readonly repository = new MasterModuleRepository();

    /** Create New Module */
    async store(req: I_RequestCustom, res: Response): Promise<Response> {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        const fileIcon = files['file_icon']?.[0];
        const fileLogo = files['file_logo']?.[0];

        const payload: Record<string, any> = {
            module_name: req?.body?.module_name,
            folder_name: req?.body?.folder_name,
            order_number: req?.body?.order_number,
            icon: fileIcon?.path || null,
            logo: fileLogo?.path || null,
            created_at: new Date(standartDateISO()),
            created_by: req?.user?.user_id
        };


        const result = await this.repository.store(payload)
        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }

    /** Fetch All Module */
    async fetchAll(req: Request, res: Response): Promise<Response> {

        const filters: Record<string, any> = {
            sorting: defineRequestOrder(req, sortDefault, sortRequest),
            search: (req?.query?.search as string) || null
        }

        console.log({ sorting: filters?.sorting })

        const result = await this.repository.fetchAll(filters)
        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }

    /** Fetch By Id */
    async fetchById(req: Request, res: Response): Promise<Response> {
        const result = await this.repository.fetchById(req?.params?.[propSchema.primaryKey])
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

        const result = await this.repository.softDelete(req?.params?.[propSchema.primaryKey], payload)
        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }

}

export default new MasterModuleService();