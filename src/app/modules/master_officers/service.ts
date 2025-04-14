import { Request, Response } from 'express'
import { PositionType } from '../../../interfaces/enum.interface';
import { I_MasterOfficerService } from '../../../interfaces/masterOfficer.interface';
import { MasterOfficerRepository } from './repository';
import { sendErrorResponse, sendSuccessResponse } from '../../../lib/utils/response.util';
import { allSchema as sc } from '../../../constanta'
import { standartDateISO } from '../../../lib/utils/common.util';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import { defineRequestOrderORM, defineRequestPaginateArgs } from '../../../lib/utils/request.util';
import { sortDefault, sortRequest } from './constanta';

class MasterOfficerService implements I_MasterOfficerService {
  private readonly repository = new MasterOfficerRepository();

  bodyValidation(req: Request): Record<string, any> {
    const payload: Record<string, any> = {};

    // NIP
    if (req?.body?.nip) {
      payload.nip = req?.body?.nip
    }

    // Nama Lengkap
    if (req?.body?.full_name) {
      payload.full_name = req?.body?.full_name
    }

    // Nama Jabatan
    if (req?.body?.position_type) {
      if (req?.body?.position_type == PositionType.SATKER) {
        payload.position_type = PositionType.SATKER;
      }
      else {
        payload.position_type = PositionType.UMUM;
      }
    }

    if (req?.body?.job_category_id) {
      payload.job_category_id = req?.body?.job_category_id
    }

    if (req?.body?.unit_id) {
      payload.unit_id = req?.body?.unit_id
    }


    if (req?.body?.start_date_position) {
      payload.start_date_position = req?.body?.start_date_position
    }

    if (req?.body?.end_date_position) {
      payload.end_date_position = req?.body?.end_date_position
    }

    if (req?.body?.is_not_specified) {
      payload.is_not_specified = Boolean(req?.body?.is_not_specified)
    }

    return payload;
  }

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

  async fetchById(req: Request, res: Response): Promise<Response> {
    const id: string = req?.params?.[sc.master_officers.primaryKey]
    const result = await this.repository.fetchById(id)

    if (!result?.success) {
      return sendErrorResponse(res, 400, result.message, result.record);
    }

    return sendSuccessResponse(res, 200, result.message, result.record);
  }

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


  async update(req: I_RequestCustom, res: Response): Promise<Response> {
    const today: Date = new Date(standartDateISO())
    const id: string = req?.params?.[sc.sppd_cost.primaryKey];
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

  async softDelete(req: I_RequestCustom, res: Response): Promise<Response> {
    const today: Date = new Date(standartDateISO())
    const id: string = req?.params?.[sc.master_officers.primaryKey];
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

export default new MasterOfficerService();
