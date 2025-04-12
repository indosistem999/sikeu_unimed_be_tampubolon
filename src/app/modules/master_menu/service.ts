import { Request, Response } from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../../../lib/utils/response.util';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import { I_MasterIdentityService } from '../../../interfaces/masterIdentity.interface';
import MasterMenuRepository from './repository';
import { menuSchema, sortDefault, sortRequest } from './constanta';
import { standartDateISO } from '../../../lib/utils/common.util';
import path from 'path';
import { getFileFromStorage, removeFileInStorage } from '../../../config/storages';
import { I_MasterMenuService } from '../../../interfaces/masterMenu.interface';
import { defineRequestOrder } from '../../../lib/utils/request.util';
import AppDataSource from '../../../config/dbconfig';


class MasterMenuService implements I_MasterMenuService {
  private readonly repository = new MasterMenuRepository();

  bodyValidation(req: Request): Record<string, any> {
    const payload: Record<string, any> = {};

    if (req?.body?.module_id) {
      payload.module_id = req?.body?.module_id
    }

    if (req?.body?.name) {
      payload.name = req?.body?.name
    }

    if (req?.body?.slug) {
      payload.slug = req?.body?.slug
    }

    if (req?.body?.order_number) {
      payload.order_number = req?.body?.order_number
    }

    if (req?.body?.parent_id) {
      payload.parent_id = req?.body?.parent_id
    }

    return payload;
  }

  /** Fetch Data */
  async fetch(req: Request, res: Response): Promise<Response> {
    const filters: Record<string, any> = {
      sorting: defineRequestOrder(req, sortDefault, sortRequest),
      search: (req?.query?.search as string) || null,
      module_id: req?.query?.module_id ? req?.query?.module_id : null
    }

    const result = await this.repository.fetch(filters)
    if (!result?.success) {
      return sendErrorResponse(res, 400, result.message, result.record);
    }

    return sendSuccessResponse(res, 200, result.message, result.record);
  }

  /** Fetch By Id */
  async fetchById(req: Request, res: Response): Promise<Response> {
    const id: string = req?.params?.[menuSchema.primaryKey]
    const result = await this.repository.fetchById(id)

    if (!result?.success) {
      return sendErrorResponse(res, 400, result.message, result.record);
    }

    return sendSuccessResponse(res, 200, result.message, result.record);
  }

  /** Store Identity */
  async store(req: I_RequestCustom, res: Response, type_store: string = 'parent'): Promise<Response> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const today: Date = new Date(standartDateISO())
      let payload: Record<string, any> = {
        created_at: today,
        created_by: req?.user?.user_id,
        ...this.bodyValidation(req),
        type_store
      }

      if (req?.file) {
        const fileName = req?.file ? req?.file?.filename : null
        payload.logo = fileName !== null ? path.join('icon', fileName) : null
      }

      const result = await this.repository.store(payload);

      if (!result?.success) {
        // If store fails, cleanup uploaded file if any
        if (req?.file) {
          await removeFileInStorage(payload.logo);
        }
        await queryRunner.rollbackTransaction();
        return sendErrorResponse(res, 400, result.message, result.record);
      }

      await queryRunner.commitTransaction();
      return sendSuccessResponse(res, 200, result.message, result.record);
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      return sendErrorResponse(res, 500, 'Internal server error', error);
    } finally {
      await queryRunner.release();
    }
  }

  /** Update By Id */
  async update(req: I_RequestCustom, res: Response): Promise<Response> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const today: Date = new Date(standartDateISO())
      const id: string = req?.params?.[menuSchema.primaryKey];
      let payload: Record<string, any> = {
        updated_at: today,
        updated_by: req?.user?.user_id,
        ...this.bodyValidation(req)
      }

      if (req?.file) {
        const fileName = req?.file ? req?.file?.filename : null
        payload = {
          ...payload,
          icon: fileName !== null ? path.join('icon', fileName) : null,
        }
      }

      const result = await this.repository.update(id, payload);

      if (!result?.success) {
        // If update fails, cleanup newly uploaded file if any
        if (req?.file) {
          await removeFileInStorage(payload.icon);
        }
        await queryRunner.rollbackTransaction();
        return sendErrorResponse(res, 400, result.message, result.record);
      }

      await queryRunner.commitTransaction();
      return sendSuccessResponse(res, 200, result.message, result.record);
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      return sendErrorResponse(res, 500, 'Internal server error', error);
    } finally {
      await queryRunner.release();
    }
  }


  /** Soft Delete By Id */
  async softDelete(req: I_RequestCustom, res: Response): Promise<Response> {
    const today: Date = new Date(standartDateISO())
    const id: string = req?.params?.[menuSchema.primaryKey];
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

export default new MasterMenuService();
