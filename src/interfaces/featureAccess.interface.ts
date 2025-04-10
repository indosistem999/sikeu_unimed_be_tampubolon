import { I_RequestCustom, I_ResultService } from "./app.interface";
import { Request, Response } from 'express'

export interface I_FeatureAccessRepository {
  store?(roleId: string, payload: Record<string, any>): Promise<I_ResultService>
  fetch?(roleId: string, moduleId: string): Promise<I_ResultService>
}
export interface I_FeatureAccessService {
  store?(req: I_RequestCustom, res: Response): Promise<Response>
  fetch?(req: I_RequestCustom, res: Response): Promise<Response>
}