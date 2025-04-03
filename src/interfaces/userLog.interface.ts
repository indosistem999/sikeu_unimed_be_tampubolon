import {Request, Response} from 'express'
import { I_ResultService } from './app.interface';


export interface I_UserLogRepository {
    store?(payload:I_UserLogRequest ): Promise<I_ResultService>

}

/** Auth Service Interface */
export interface I_UserLogService {
    store?(req: Request, res: Response): Promise<Response>;
  
}

export interface I_UserLogRequest {
    user_id: string;
    activity_type: string;
    activity_time: Date;
    description: string | null
}