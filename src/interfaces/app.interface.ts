import { Request, Response } from 'express';
import { I_AuthUserPayload } from './auth.interface';

export interface I_RequestCustom extends Request {
  [key: string]: any; // Or specify more precise types
}

export interface I_AppError extends Error {
  statusCode?: number;
}

export interface I_BaseTimestamp {
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export interface I_RowsAndCount {
  rows: Record<string, any>[];
  total_rows: number;
}

export interface I_ResultService {
  success: boolean;
  message: string;
  record: Record<string, any> | object | any;
}

export interface I_BasedController {
  fetchBy?(req: Request, res: Response): Promise<Response>;
  fetch?(req: Request, res: Response): Promise<Response>;
  store?(req: Request, res: Response): Promise<Response>;
  update?(req: Request, res: Response): Promise<Response>;
  delete?(req: Request, res: Response): Promise<Response>;
}

export interface I_MailAttributes {
  from?: string;
  to: string;
  cc?: string;
  subject: string;
  text?: string;
  attachments?: any;
  html?: string;
  additional?: Record<string, any>;
}

export interface I_MailTemplateSender {
  sender: string;
  receiver: string;
  subject: string;
  cc: string | any;
  attachments: any;
  template: string;
  data: Record<string, any>;
}

export interface I_ResultMailSender {
  success: boolean;
  data?: any;
  message?: string;
}


export interface I_FileOptionInterface {
  mime_allowed: string[];
  extension_allowed: string[];
  size: number;
}
