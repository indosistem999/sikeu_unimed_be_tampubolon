import { Request, Response } from 'express'
import { I_RequestCustom, I_ResultService } from './app.interface';
import { Users } from '../database/models/Users';


export interface I_UserLogRepository {
    fetch(req: I_RequestCustom, filters: Record<string, any>): Promise<I_ResultService>

}

/** Auth Service Interface */
export interface I_UserLogService {
    fetch?(req: Request, res: Response): Promise<Response>

}
