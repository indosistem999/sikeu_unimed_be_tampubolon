import AppDataSource from '../../../config/dbconfig';
import { SppdSuratTugas } from '../../../database/models/SppdSuratTugas';
import { I_PaginateArgs } from '../../../interfaces/pagination.interface';
import { MessageDialog } from '../../../lang';
import { IsNull } from 'typeorm';

export class SppdSuratTugasRepository {
    private readonly repository = AppDataSource.getRepository(SppdSuratTugas);

    async fetch(filters: { paging: I_PaginateArgs; sorting: any }) {
        try {
            const { paging, sorting } = filters;
            const [data, total] = await this.repository.findAndCount({
                where: {
                    deleted_at: IsNull()
                },
                skip: paging.page,
                take: paging.limit,
                order: sorting
            });

            return {
                success: true,
                message: MessageDialog.__('success.sppdSuratTugas.fetch'),
                record: {
                    data,
                    paging: {
                        page: paging.page,
                        limit: paging.limit,
                        total
                    }
                }
            };
        } catch (error) {
            return {
                success: false,
                message: MessageDialog.__('error.failed.storeSuratTugas'),
                record: error
            };
        }
    }

    async store(payload: Record<string, any>) {
        try {
            const result = await this.repository.save(payload);

            return {
                success: true,
                message: MessageDialog.__('success.sppdSuratTugas.store'),
                record: result
            };
        } catch (error) {
            return {
                success: false,
                message: MessageDialog.__('error.failed.storeSuratTugas'),
                record: error
            };
        }
    }

    async fetchById(id: string) {
        try {
            const result = await this.repository.findOne({
                where: {
                    surat_tugas_id: id,
                    deleted_at: IsNull()
                }
            });

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.notFound.sppdSuratTugas'),
                    record: null
                };
            }

            return {
                success: true,
                message: MessageDialog.__('success.sppdSuratTugas.findItem', { item: id }),
                record: result
            };
        } catch (error) {
            return {
                success: false,
                message: MessageDialog.__('error.failed.storeSuratTugas'),
                record: error
            };
        }
    }

    async update(id: string, payload: Record<string, any>) {
        try {
            const item = await this.repository.findOne({
                where: {
                    surat_tugas_id: id,
                    deleted_at: IsNull()
                }
            });

            if (!item) {
                return {
                    success: false,
                    message: MessageDialog.__('error.notFound.sppdSuratTugas'),
                    record: null
                };
            }

            const result = await this.repository.save({
                ...item,
                ...payload
            });

            return {
                success: true,
                message: MessageDialog.__('success.sppdSuratTugas.update'),
                record: result
            };
        } catch (error) {
            return {
                success: false,
                message: MessageDialog.__('error.failed.storeSuratTugas'),
                record: error
            };
        }
    }

    async softDelete(id: string, payload: Record<string, any>) {
        try {
            const item = await this.repository.findOne({
                where: {
                    surat_tugas_id: id,
                    deleted_at: IsNull()
                }
            });

            if (!item) {
                return {
                    success: false,
                    message: MessageDialog.__('error.notFound.sppdSuratTugas'),
                    record: null
                };
            }

            const result = await this.repository.save({
                ...item,
                ...payload
            });

            return {
                success: true,
                message: MessageDialog.__('success.sppdSuratTugas.softDelete'),
                record: result
            };
        } catch (error) {
            return {
                success: false,
                message: MessageDialog.__('error.failed.storeSuratTugas'),
                record: error
            };
        }
    }

    async previewPegawai(id: string) {
        try {
            const result = await this.repository.findOne({
                where: {
                    surat_tugas_id: id,
                    deleted_at: IsNull()
                },
                relations: ['pegawais'],
                select: {
                    surat_tugas_id: true,
                    nomor_surat: true,
                    tanggal_surat: true,
                    kegiatan: true,
                    pegawais: {
                        assign_surat_id: true,
                        pegawai_id: true,
                        jabatan_kegiatan: true,
                        tanggal_pergi: true,
                        tanggal_pulang: true
                    }
                }
            });

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.notFound.sppdSuratTugas'),
                    record: null
                };
            }

            return {
                success: true,
                message: MessageDialog.__('success.sppdSuratTugas.previewPegawai'),
                record: result
            };
        } catch (error) {
            return {
                success: false,
                message: MessageDialog.__('error.failed.previewPegawai'),
                record: error
            };
        }
    }
} 