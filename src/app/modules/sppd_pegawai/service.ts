import { Request, Response } from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../../../lib/utils/response.util';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import { standartDateISO } from '../../../lib/utils/common.util';
import { SppdPegawaiRepository } from './repository';
import { defineRequestOrderORM, defineRequestPaginateArgs } from '../../../lib/utils/request.util';
import { sortDefault, sortRequest } from './constanta';
import { allSchema as sc } from '../../../constanta'
import { I_SppdPegawaiService } from '../../../interfaces/sppdPegawai';
import AppDataSource from '../../../config/dbconfig';
import path from 'path';
import { removeFileInStorage } from '../../../config/storages';

class SppdPegawaiService implements I_SppdPegawaiService {
    private readonly repository = new SppdPegawaiRepository();

    bodyValidation(req: Request): Record<string, any> {
        const payload: Record<string, any> = {};

        if (req?.body?.nik) {
            payload.nik = req?.body?.nik
        }

        if (req?.body?.nip) {
            payload.nip = req?.body?.nip
        }

        if (req?.body?.nama) {
            payload.nama = req?.body?.nama
        }

        if (req?.body?.username) {
            payload.username = req?.body?.username
        }

        if (req?.body?.gelar_depan) {
            payload.gelar_depan = req?.body?.gelar_depan
        }

        if (req?.body?.email) {
            payload.email = req?.body?.email
        }


        if (req?.body?.phone) {
            payload.phone = req?.body?.phone
        }

        if (req?.body?.jenis_kepegawaian) {
            payload.jenis_kepegawaian = req?.body?.jenis_kepegawaian
        }

        if (req?.body?.status_kepegawaian) {
            payload.status_kepegawaian = req?.body?.status_kepegawaian
        }

        if (req?.body?.status_active) {
            payload.status_active = req?.body?.status_active
        }

        if (req?.body?.simpeg_id) {
            payload.simpeg_id = req?.body?.simpeg_id
        }

        if (req?.body?.pangkat_id) {
            payload.pangkat_id = req?.body?.pangkat_id
        }

        if (req?.body?.unit_id) {
            payload.unit_id = req?.body?.unit_id
        }

        return payload;
    }

    /** Fetch Data */
    async fetch(req: Request, res: Response): Promise<Response> {
        const filters: Record<string, any> = {
            paging: defineRequestPaginateArgs(req),
            sorting: defineRequestOrderORM(req, sortDefault, sortRequest),
            queries: req?.query
        }


        const result = await this.repository.fetch(filters)
        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }

    /** Fetch By Id */
    async fetchById(req: Request, res: Response): Promise<Response> {
        const id: string = req?.params?.[sc.pegawai.primaryKey]
        const result = await this.repository.fetchById(id)

        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }

    /** Store Identity */
    async store(req: I_RequestCustom, res: Response): Promise<Response> {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const today: Date = new Date(standartDateISO())
            let payload: Record<string, any> = {
                created_at: today,
                created_by: req?.user?.user_id,
                ...this.bodyValidation(req),
            }


            if (req?.file) {
                const fileName = req?.file ? req?.file?.filename : null
                payload.photo = fileName !== null ? path.join('images', fileName) : null
            }

            const result = await this.repository.store(req, payload);

            if (!result?.success) {
                if (req?.file) {
                    await removeFileInStorage(payload.photo);
                }
                await queryRunner.rollbackTransaction();

                return sendErrorResponse(res, 400, result.message, result.record);
            }

            await queryRunner.commitTransaction();
            return sendSuccessResponse(res, 200, result.message, result.record);
        } catch (error: any) {
            await queryRunner.rollbackTransaction();
            return sendErrorResponse(res, 500, 'Internal server error', error);
        } finally {
            await queryRunner.release();
        }
    }

    /** Update By Id */
    async update(req: I_RequestCustom, res: Response): Promise<Response> {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const today: Date = new Date(standartDateISO())
            const id: string = req?.params?.[sc.sppd_pangkat.primaryKey];
            let payload: Record<string, any> = {
                updated_at: today,
                updated_by: req?.user?.user_id,
                ...this.bodyValidation(req)
            }

            if (req?.file) {
                const fileName = req?.file ? req?.file?.filename : null
                payload = {
                    ...payload,
                    photo: fileName !== null ? path.join('images', fileName) : null,
                }
            }

            const result = await this.repository.update(req, id, payload)
            if (!result?.success) {
                if (req?.file) {
                    await removeFileInStorage(payload.photo);
                }
                await queryRunner.rollbackTransaction();
                return sendErrorResponse(res, 400, result.message, result.record);
            }

            await queryRunner.commitTransaction();
            return sendSuccessResponse(res, 200, result.message, result.record);
        } catch (error: any) {
            await queryRunner.rollbackTransaction();
            return sendErrorResponse(res, 500, 'Internal server error', error);
        } finally {
            await queryRunner.release();
        }
    }


    /** Soft Delete By Id */
    async softDelete(req: I_RequestCustom, res: Response): Promise<Response> {
        const today: Date = new Date(standartDateISO())
        const id: string = req?.params?.[sc.sppd_pangkat.primaryKey];
        let payload: Record<string, any> = {
            deleted_at: today,
            deleted_by: req?.user?.user_id,
        }

        const result = await this.repository.softDelete(req, id, payload)
        if (!result?.success) {
            return sendErrorResponse(res, 400, result.message, result.record);
        }

        return sendSuccessResponse(res, 200, result.message, result.record);
    }
}

export default new SppdPegawaiService();
