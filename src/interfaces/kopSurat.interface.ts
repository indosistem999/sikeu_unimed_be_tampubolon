import { Request, Response } from 'express';
import { I_ResultService } from './app.interface';

export interface I_KopSuratRepository {
    fetch(filters: Record<string, any>): Promise<I_ResultService>;
    fetchById(id: string): Promise<I_ResultService>;
    store(payload: Record<string, any>): Promise<I_ResultService>;
    storeBatch(payloads: Record<string, any>[]): Promise<I_ResultService>;
    update(id: string, payload: Record<string, any>): Promise<I_ResultService>;
    updateBatch(payloads: { id: string; data: Record<string, any> }[]): Promise<I_ResultService>;
    softDelete(id: string, payload: Record<string, any>): Promise<I_ResultService>;
    preview(id: string): Promise<I_ResultService>;
}

export interface I_KopSuratService {
    fetch(req: Request, res: Response): Promise<Response>;
    fetchById(req: Request, res: Response): Promise<Response>;
    store(req: Request, res: Response): Promise<Response>;
    storeBatch(req: Request, res: Response): Promise<Response>;
    update(req: Request, res: Response): Promise<Response>;
    updateBatch(req: Request, res: Response): Promise<Response>;
    softDelete(req: Request, res: Response): Promise<Response>;
    preview(req: Request, res: Response): Promise<Response>;
} 