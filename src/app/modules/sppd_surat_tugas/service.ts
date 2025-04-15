import { Request, Response } from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../../../lib/utils/response.util';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import { defineRequestOrderORM, defineRequestPaginateArgs } from '../../../lib/utils/request.util';
import { sortDefault, sortRequest } from './constanta';
import { SppdSuratTugasRepository } from './repository';
import { allSchema as sc } from '../../../constanta';
import { MessageDialog } from '../../../lang';
import { v4 as uuidv4 } from 'uuid';
import { getRepository } from 'typeorm';
import { SppdSuratTugas } from '../../../database/models/SppdSuratTugas';
import { SppdSuratTugasSppd } from '../../../database/models/SppdSuratTugasSppd';
import { CreateSppdDto, UpdateSppdDto } from './dto';
import { NotFoundException } from '../../../core/exceptions/not-found.exception';

class SppdSuratTugasService {
    private readonly repository = new SppdSuratTugasRepository();

    bodyValidation(req: Request): Record<string, any> {
        const payload: Record<string, any> = {};

        if (req?.body?.unit_id) {
            payload.unit_id = req?.body?.unit_id;
        }

        if (req?.body?.bagian_surat_id) {
            payload.bagian_surat_id = req?.body?.bagian_surat_id;
        }

        if (req?.body?.nomor_surat) {
            payload.nomor_surat = req?.body?.nomor_surat;
        }

        if (req?.body?.tanggal_surat) {
            payload.tanggal_surat = req?.body?.tanggal_surat;
        }

        if (req?.body?.kegiatan) {
            payload.kegiatan = req?.body?.kegiatan;
        }

        if (req?.body?.awal_kegiatan) {
            payload.awal_kegiatan = req?.body?.awal_kegiatan;
        }

        if (req?.body?.akhir_kegiatan) {
            payload.akhir_kegiatan = req?.body?.akhir_kegiatan;
        }

        if (req?.body?.only_one !== undefined) {
            payload.only_one = req?.body?.only_one;
        }

        if (req?.body?.lokasi_kegiatan) {
            payload.lokasi_kegiatan = req?.body?.lokasi_kegiatan;
        }

        if (req?.body?.officers_id) {
            payload.officers_id = req?.body?.officers_id;
        }

        if (req?.body?.file_undangan) {
            payload.file_undangan = req?.body?.file_undangan;
        }

        return payload;
    }

    async fetch(req: Request, res: Response): Promise<Response> {
        try {
            const filters = {
                paging: defineRequestPaginateArgs(req),
                sorting: defineRequestOrderORM(req, sortDefault, sortRequest)
            };
            const result = await this.repository.fetch(filters);

            if (!result.success) {
                return sendErrorResponse(res, 400, result.message, result.record);
            }

            return sendSuccessResponse(res, 200, MessageDialog.__('success.sppdSuratTugas.fetch'), result.record);
        } catch (error) {
            return sendErrorResponse(res, 500, MessageDialog.__('error.failed.storeSuratTugas'), error);
        }
    }

    async store(req: Request, res: Response): Promise<Response> {
        try {
            const payload = {
                ...this.bodyValidation(req),
                created_by: (req as I_RequestCustom)?.user?.user_id
            };
            const result = await this.repository.store(payload);

            if (!result.success) {
                return sendErrorResponse(res, 400, result.message, result.record);
            }

            return sendSuccessResponse(res, 200, MessageDialog.__('success.sppdSuratTugas.store'), result.record);
        } catch (error) {
            return sendErrorResponse(res, 500, MessageDialog.__('error.failed.storeSuratTugas'), error);
        }
    }

    async fetchById(req: Request, res: Response): Promise<Response> {
        try {
            const result = await this.repository.fetchById(req?.params?.surat_tugas_id);

            if (!result.success) {
                return sendErrorResponse(res, 404, result.message, result.record);
            }

            return sendSuccessResponse(res, 200, MessageDialog.__('success.sppdSuratTugas.findItem', { item: (result.record as SppdSuratTugas).surat_tugas_id }), result.record);
        } catch (error) {
            return sendErrorResponse(res, 500, MessageDialog.__('error.failed.storeSuratTugas'), error);
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        try {
            const payload = {
                ...this.bodyValidation(req),
                updated_by: (req as I_RequestCustom)?.user?.user_id,
                updated_at: new Date()
            };
            const result = await this.repository.update(req?.params?.surat_tugas_id, payload);

            if (!result.success) {
                return sendErrorResponse(res, 404, result.message, result.record);
            }

            return sendSuccessResponse(res, 200, MessageDialog.__('success.sppdSuratTugas.update'), result.record);
        } catch (error) {
            return sendErrorResponse(res, 500, MessageDialog.__('error.failed.storeSuratTugas'), error);
        }
    }

    async softDelete(req: Request, res: Response): Promise<Response> {
        try {
            const result = await this.repository.softDelete(req?.params?.surat_tugas_id, {
                deleted_at: new Date(),
                deleted_by: (req as I_RequestCustom)?.user?.user_id
            });

            if (!result.success) {
                return sendErrorResponse(res, 404, result.message, result.record);
            }

            return sendSuccessResponse(res, 200, MessageDialog.__('success.sppdSuratTugas.softDelete'), result.record);
        } catch (error) {
            return sendErrorResponse(res, 500, MessageDialog.__('error.failed.storeSuratTugas'), error);
        }
    }

    async previewPegawai(req: Request, res: Response): Promise<Response> {
        try {
            const result = await this.repository.previewPegawai(req?.params?.surat_tugas_id);

            if (!result.success) {
                return sendErrorResponse(res, 404, result.message, result.record);
            }

            return sendSuccessResponse(res, 200, MessageDialog.__('success.sppdSuratTugas.previewPegawai'), result.record);
        } catch (error) {
            return sendErrorResponse(res, 500, MessageDialog.__('error.failed.previewPegawai'), error);
        }
    }

    public async createSppd(suratTugasId: string, dto: CreateSppdDto, userId: string | null = null): Promise<SppdSuratTugasSppd> {
        const suratTugasRepo = getRepository(SppdSuratTugas);
        const sppdRepo = getRepository(SppdSuratTugasSppd);

        // Check if Surat Tugas exists
        const suratTugas = await suratTugasRepo.findOne({ where: { surat_tugas_id: suratTugasId } });
        if (!suratTugas) {
            throw new NotFoundException('Surat Tugas not found');
        }

        // Create new SPPD
        const sppd = new SppdSuratTugasSppd();
        sppd.sppd_id = uuidv4();
        sppd.surat_tugas_id = suratTugasId;
        Object.assign(sppd, dto);
        if (userId) {
            sppd.created_by = userId;
        }

        return await sppdRepo.save(sppd);
    }

    public async updateSppd(suratTugasId: string, sppdId: string, dto: UpdateSppdDto, userId: string | null = null): Promise<SppdSuratTugasSppd> {
        const sppdRepo = getRepository(SppdSuratTugasSppd);

        // Check if SPPD exists
        const sppd = await sppdRepo.findOne({
            where: {
                sppd_id: sppdId,
                surat_tugas_id: suratTugasId
            }
        });

        if (!sppd) {
            throw new NotFoundException('SPPD not found');
        }

        // Update SPPD
        Object.assign(sppd, dto);
        if (userId) {
            sppd.updated_by = userId;
        }
        sppd.updated_at = new Date();

        return await sppdRepo.save(sppd);
    }

    public async deleteSppd(suratTugasId: string, sppdId: string, userId: string | null = null): Promise<SppdSuratTugasSppd> {
        const sppdRepo = getRepository(SppdSuratTugasSppd);

        // Check if SPPD exists
        const sppd = await sppdRepo.findOne({
            where: {
                sppd_id: sppdId,
                surat_tugas_id: suratTugasId
            }
        });

        if (!sppd) {
            throw new NotFoundException('SPPD not found');
        }

        // Soft delete SPPD
        if (userId) {
            sppd.deleted_by = userId;
        }
        sppd.deleted_at = new Date();

        return await sppdRepo.save(sppd);
    }

    public async previewSppd(suratTugasId: string, sppdId: string): Promise<SppdSuratTugasSppd> {
        const sppdRepo = getRepository(SppdSuratTugasSppd);

        // Find SPPD with relations
        const sppd = await sppdRepo.findOne({
            where: {
                sppd_id: sppdId,
                surat_tugas_id: suratTugasId
            },
            relations: ['suratTugas']
        });

        if (!sppd) {
            throw new NotFoundException('SPPD not found');
        }

        return sppd;
    }
}

export default new SppdSuratTugasService(); 