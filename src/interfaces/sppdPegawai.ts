import { Request, Response } from 'express'
import { I_RequestCustom, I_ResultService } from './app.interface'


export interface I_SppdPegawaiRepository {
    fetch(filters: Record<string, any>): Promise<I_ResultService>
    fetchById?(id: string): Promise<I_ResultService>
    store?(req: I_RequestCustom, payload: Record<string, any>): Promise<I_ResultService>
    softDelete?(req: I_RequestCustom, id: string, payload: Record<string, any>): Promise<I_ResultService>
    update?(req: I_RequestCustom, id: string, payload: Record<string, any>): Promise<I_ResultService>
}

export interface I_SppdPegawaiService {
    fetch?(req: Request, res: Response): Promise<Response>
    fetchById?(req: Request, res: Response): Promise<Response>
    store?(req: I_RequestCustom, res: Response): Promise<Response>
    update?(req: I_RequestCustom, res: Response): Promise<Response>
    softDelete?(req: Request, res: Response): Promise<Response>
}
