import { Request, Response } from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../../../lib/utils/response.util';
import { getHostProtocol, standartDateISO } from '../../../lib/utils/common.util';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import { I_RoleAssignModuleService } from '../../../interfaces/roleAssignModule.interface';
import RoleAssignModuleRepository from './roleAssignModule.repository';
import { allSchema as sc } from '../../../constanta'


class RoleAssignModuleService implements I_RoleAssignModuleService {
  private readonly repository = new RoleAssignModuleRepository();

  bodyValidation(req: Request): Record<string, any> {
    let payload: Record<string, any> = {};

    if (req?.body?.module_id) {
      payload.module_id = req?.body?.module_id
    }

    return payload;
  }


  async fetch(req: Request, res: Response): Promise<Response> {
    const payload: Record<string, any> = {
      role_id: req?.params?.[sc.role.primaryKey],
      base_url: `${getHostProtocol(req)}/api/v1/role-assign-module/files`
    }
    const result = await this.repository.fetch(payload)

    if (!result?.success) {
      return sendErrorResponse(res, 400, result.message, result.record);
    }

    return sendSuccessResponse(res, 200, result.message, result.record);
  }



  /** Store Identity */
  async store(req: I_RequestCustom, res: Response): Promise<Response> {
    const today: Date = new Date(standartDateISO())
    const roleId: string = req?.params?.[sc.role.primaryKey]

    let payload: Record<string, any> = {
      created_at: today,
      created_by: req?.user?.user_id,
      updated_at: today,
      updated_by: req?.user?.user_id,
      ...this.bodyValidation(req),
    }

    console.log({ roleId, payload })

    const result = await this.repository.store(roleId, payload);

    if (!result?.success) {
      return sendErrorResponse(res, 400, result.message, result.record);
    }

    return sendSuccessResponse(res, 200, result.message, result.record);
  }

  /** Update By Id */
  async softDelete(req: I_RequestCustom, res: Response): Promise<Response> {
    const payload: Record<string, any> = {
      deleted_at: new Date(standartDateISO()),
      deleted_by: req?.user?.user_id
    }
    const roleId: string = req?.params?.[sc.role.primaryKey];
    const moduleId: string = req?.params?.[sc.module.primaryKey]

    const result = await this.repository.delete(roleId, moduleId, payload);

    if (!result?.success) {
      return sendErrorResponse(res, 400, result.message, result.record);
    }

    return sendSuccessResponse(res, 200, result.message, result.record);
  }



}

export default new RoleAssignModuleService();
