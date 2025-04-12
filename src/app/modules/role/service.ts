import { Request, Response } from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../../../lib/utils/response.util';
import { I_RoleService } from '../../../interfaces/role.interface';
import { defineRequestOrderORM, defineRequestPaginateArgs } from '../../../lib/utils/request.util';
import { sortDefault, sortRequest } from './constanta';
import { generateSlug, standartDateISO } from '../../../lib/utils/common.util';
import { allSchema as sc } from '../../../constanta'

import RoleRepository from './repository';
import { I_RequestCustom } from '../../../interfaces/app.interface';


class RoleService implements I_RoleService {
  private readonly repository = new RoleRepository();

  bodyValidation(req: Request): Record<string, any> {
    let payload: Record<string, any> = {};


    if (req?.body?.role_name) {
      const name: string = req?.body?.role_name
      payload.role_name = name
      payload.role_slug = generateSlug(name);
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
    const id: string = req?.params?.[sc.role.primaryKey]
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

    const result = await this.repository.update(id, payload)
    if (!result?.success) {
      return sendErrorResponse(res, 400, result.message, result.record);
    }

    return sendSuccessResponse(res, 200, result.message, result.record);
  }


  /** Soft Delete By Id */
  async softDelete(req: I_RequestCustom, res: Response): Promise<Response> {
    const today: Date = new Date(standartDateISO())
    const id: string = req?.params?.[sc.role.primaryKey];
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

export default new RoleService();
