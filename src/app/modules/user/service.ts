import { Request, Response } from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../../../lib/utils/response.util';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import { I_UserService } from '../../../interfaces/user.interface';
import { defineRequestOrderORM, defineRequestPaginateArgs } from '../../../lib/utils/request.util';
import UserRepository from './repository';
import { sortDefault, sortRequest } from './constanta';
import { splitFullName, standartDateISO } from '../../../lib/utils/common.util';
import path from 'path';
import { encryptPassword } from '../../../lib/utils/bcrypt.util';
import { Config } from '../../../constanta';
import { getFileFromStorage } from '../../../config/storages';
import { allSchema as sc } from '../../../constanta'
import { I_PaginateArgs } from '../../../interfaces/pagination.interface';


class UserService implements I_UserService {
    private readonly repository = new UserRepository();

    bodyValidation(req: Request): Record<string, any> {
        let payload: Record<string, any> = {};

        if (req?.body?.name) {
            payload = { ...splitFullName(req?.body?.name) }
        }

        if (req?.body?.email) {
            payload.email = req?.body?.email
        }

        if (req?.body?.phone_number) {
            payload.phone_number = req?.body?.phone_number
        }

        if (req?.body?.gender) {
            payload.gender = req?.body?.gender
        }

        if (req?.body?.has_work_unit) {
            const condition = Number(req?.body?.has_work_unit)
            payload.has_work_unit = condition
        }


        if (req?.body?.role_id) {
            payload.role_id = req?.body?.role_id
        }


        if (req?.body?.unit_id) {
            payload.unit_id = req?.body?.unit_id
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
        const id: string = req?.params?.[sc.user.primaryKey]
        const result = await this.repository.fetchById(id)

        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }

    /** Store Identity */
    async store(req: I_RequestCustom, res: Response): Promise<Response> {
        const today: Date = new Date(standartDateISO())
        const { salt, password_hash } = await encryptPassword(Config.UserDefaultPassword);

        let payload: Record<string, any> = {
            created_at: today,
            created_by: req?.user?.user_id,
            ...this.bodyValidation(req),
            salt,
            password: password_hash,
            registered_date: today,
            verified_at: today
        }

        if (req?.file) {
            const fileName = req?.file ? req?.file?.filename : null
            payload.photo = fileName !== null ? path.join('images', fileName) : null
        }


        const result = await this.repository.store(payload);

        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }

    /** Update By Id */
    async update(req: I_RequestCustom, res: Response): Promise<Response> {
        const today: Date = new Date(standartDateISO())
        const id: string = req?.params?.[sc.user.primaryKey];
        let payload: Record<string, any> = {
            updated_at: today,
            updated_by: req?.user?.user_id,
            ...this.bodyValidation(req)
        }


        if (req?.file) {
            const fileName = req?.file ? req?.file?.filename : null
            payload = {
                ...payload,
                photo: fileName !== null ? path.join('images', fileName) : null,
            }
        }

        console.log({ payload })

        const result = await this.repository.update(id, payload)
        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }


    /** Soft Delete By Id */
    async softDelete(req: I_RequestCustom, res: Response): Promise<Response> {
        const today: Date = new Date(standartDateISO())
        const id: string = req?.params?.[sc.user.primaryKey];
        let payload: Record<string, any> = {
            deleted_at: today,
            deleted_by: req?.user?.user_id,
        }

        const result = await this.repository.softDelete(id, payload)
        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }

}

export default new UserService();
