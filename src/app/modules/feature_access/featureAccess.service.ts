import { Request, Response } from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../../../lib/utils/response.util';
import { getHostProtocol, standartDateISO } from '../../../lib/utils/common.util';
import { I_RequestCustom, I_ResultService } from '../../../interfaces/app.interface';

import { allSchema as sc } from '../../../constanta'
import FeatureAccessRepository from './featureAccess.repository';
import { I_FeatureAccessRepository, I_FeatureAccessService } from '../../../interfaces/featureAccess.interface';


class FeatureAccessService implements I_FeatureAccessService {
  private readonly repository = new FeatureAccessRepository();

  bodyValidation(req: Request): Record<string, any> {
    let payload: Record<string, any> = {};

    if (req?.body?.features) {
      payload.features = req?.body?.features
    }

    return payload;
  }

  async fetch(req: I_RequestCustom, res: Response): Promise<Response> {
    const roleId: string = req?.params?.[sc.role.primaryKey]
    const moduleId: string = req?.params?.[sc.module.primaryKey]
    const result = await this.repository.fetch(roleId, moduleId);

    if (!result?.success) {
      return sendErrorResponse(res, 400, result.message, result.record);
    }

    return sendSuccessResponse(res, 200, result.message, result.record);
  }


  async store(req: I_RequestCustom, res: Response): Promise<Response> {
    const today: Date = new Date(standartDateISO())
    const roleId: string = req?.params?.[sc.role.primaryKey]

    let payload: Record<string, any> = {
      created_at: today,
      created_by: req?.user?.user_id,
      ...this.bodyValidation(req),
    }

    console.log({ payload })

    const result = await this.repository.store(roleId, payload);

    if (!result?.success) {
      return sendErrorResponse(res, 400, result.message, result.record);
    }

    return sendSuccessResponse(res, 200, result.message, result.record);
  }

}

export default new FeatureAccessService();
