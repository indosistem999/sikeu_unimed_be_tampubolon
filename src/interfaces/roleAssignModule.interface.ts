import { I_RequestCustom, I_ResultService } from "./app.interface";
import { Request, Response } from 'express'

export interface I_RoleAssignModuleRepository {
  fetch?(payload: Record<string, any>): Promise<I_ResultService>
  store?(req: I_RequestCustom, id: string, payload: Record<string, any>): Promise<I_ResultService>
  delete?(req: I_RequestCustom, roleId: string, moduleId: string, payload: Record<string, any>): Promise<I_ResultService>
}
export interface I_RoleAssignModuleService {
  store?(req: I_RequestCustom, res: Response): Promise<Response>
  delete?(req: I_RequestCustom, res: Response): Promise<Response>
  fetch?(req: Request, res: Response): Promise<Response>
}