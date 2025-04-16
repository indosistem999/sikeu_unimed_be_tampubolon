import { Request, Response } from 'express'
import { I_RequestCustom, I_ResultService } from './app.interface'

export interface I_MasterModuleRepository {
    store?(req: I_RequestCustom, payload: Record<string, any>): Promise<I_ResultService>
    fetchAll?(req: Request): Promise<I_ResultService>
    fetchById?(id: string): Promise<I_ResultService>
    softDelete?(req: I_RequestCustom, id: string, payload: Record<string, any>): Promise<I_ResultService>
    update?(req: I_RequestCustom, id: string, payload: Record<string, any>): Promise<I_ResultService>
}

export interface I_MasterModuleService {
    store?(req: I_RequestCustom, res: Response): Promise<Response>
    fetchAll?(req: Request, res: Response): Promise<Response>
    fetchById?(req: Request, res: Response): Promise<Response>
    softDelete?(req: Request, res: Response): Promise<Response>
    update?(req: Request, res: Response): Promise<Response>
    showFile?(req: Request, res: Response): Response | any
}
