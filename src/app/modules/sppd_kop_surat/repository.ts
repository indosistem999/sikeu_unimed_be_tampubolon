import { IsNull, Like } from "typeorm";
import AppDataSource from "../../../config/dbconfig";
import { I_ResultService } from "../../../interfaces/app.interface";
import { MessageDialog } from "../../../lang";
import { I_ResponsePagination } from "../../../interfaces/pagination.interface";
import { setPagination } from "../../../lib/utils/pagination.util";
import { I_KopSuratRepository } from "../../../interfaces/kopSurat.interface";
import { SPPDKopSurat } from "../../../database/models/SPPDKopsurat";

export class KopSuratRepository implements I_KopSuratRepository {
    private repository = AppDataSource.getRepository(SPPDKopSurat);

    setupErrorMessage(error: any): I_ResultService {
        return {
            success: false,
            message: error.message,
            record: error
        }
    }

    async fetch(filters: Record<string, any>): Promise<I_ResultService> {
        try {
            const { paging, sorting } = filters
            let whereConditions: Record<string, any>[] = []

            if (paging?.search && paging?.search != '' && paging?.search != null) {
                const searchTerm: string = paging?.search
                whereConditions = [
                    { description: Like(`%${searchTerm}%`), deleted_at: IsNull() },
                    { font_type: Like(`%${searchTerm}%`), deleted_at: IsNull() },
                    { font_style: Like(`%${searchTerm}%`), deleted_at: IsNull() },
                    { font_size: Like(`%${searchTerm}%`), deleted_at: IsNull() }
                ];
            }

            let [rows, count] = await this.repository.findAndCount({
                where: whereConditions,
                skip: paging?.skip,
                take: paging?.limit,
                order: sorting
            })

            const pagination: I_ResponsePagination = setPagination(rows, count, paging.page, paging.limit);

            return {
                success: true,
                message: MessageDialog.__('success.kopSurat.fetch'),
                record: pagination
            }
        } catch (error: any) {
            return this.setupErrorMessage(error)
        }
    }

    async fetchById(id: string): Promise<I_ResultService> {
        try {
            const result = await this.repository.findOne({
                where: {
                    deleted_at: IsNull(),
                    kopsurat_id: id
                },
            });

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'Kop Surat' }),
                    record: result
                }
            }

            return {
                success: true,
                message: MessageDialog.__('success.kopSurat.fetch'),
                record: result
            }
        } catch (error: any) {
            return this.setupErrorMessage(error);
        }
    }

    async store(payload: Record<string, any>): Promise<I_ResultService> {
        try {
            const result = await this.repository.save(this.repository.create(payload))

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.failed.storeKopSurat'),
                    record: result
                }
            }

            return {
                success: true,
                message: MessageDialog.__('success.kopSurat.store'),
                record: result
            }
        } catch (err: any) {
            return this.setupErrorMessage(err)
        }
    }

    async update(id: string, payload: Record<string, any>): Promise<I_ResultService> {
        try {
            let result = await this.repository.findOne({
                where: {
                    deleted_at: IsNull(),
                    kopsurat_id: id
                }
            });

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'Kop Surat' }),
                    record: result
                }
            }

            result = { ...result, ...payload }

            await this.repository.save(result);

            return {
                success: true,
                message: MessageDialog.__('success.kopSurat.update'),
                record: {
                    kopsurat_id: result?.kopsurat_id,
                }
            }

        } catch (error: any) {
            return this.setupErrorMessage(error)
        }
    }

    async softDelete(id: string, payload: Record<string, any>): Promise<I_ResultService> {
        try {
            let result = await this.repository.findOne({
                where: {
                    kopsurat_id: id,
                    deleted_at: IsNull()
                }
            })

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'Kop Surat' }),
                    record: result
                }
            }

            result = {
                ...result,
                ...payload
            }

            await this.repository.save(result);

            return {
                success: true,
                message: MessageDialog.__('success.kopSurat.softDelete'),
                record: {
                    kopsurat_id: id
                }
            }
        } catch (error: any) {
            return this.setupErrorMessage(error)
        }
    }

    async preview(id: string): Promise<I_ResultService> {
        try {
            const result = await this.repository.findOne({
                where: {
                    deleted_at: IsNull(),
                    kopsurat_id: id
                },
            });

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'Kop Surat' }),
                    record: result
                }
            }

            // Generate preview HTML based on the kop surat properties
            const previewHtml = `
                <div style="font-family: ${result.font_type}; font-size: ${result.font_size}; font-style: ${result.font_style};">
                    ${result.description || ''}
                </div>
            `;

            return {
                success: true,
                message: MessageDialog.__('success.kopSurat.preview'),
                record: {
                    ...result,
                    preview_html: previewHtml
                }
            }
        } catch (error: any) {
            return this.setupErrorMessage(error);
        }
    }

    async storeBatch(payloads: Record<string, any>[]): Promise<I_ResultService> {
        try {
            const results = await Promise.all(
                payloads.map(async (payload) => {
                    return await this.repository.save(this.repository.create(payload));
                })
            );

            if (!results || results.length === 0) {
                return {
                    success: false,
                    message: MessageDialog.__('error.failed.storeKopSurat'),
                    record: results
                }
            }

            return {
                success: true,
                message: MessageDialog.__('success.kopSurat.store'),
                record: results
            }
        } catch (err: any) {
            return this.setupErrorMessage(err)
        }
    }

    async updateBatch(payloads: { id: string; data: Record<string, any> }[]): Promise<I_ResultService> {
        try {
            const results = await Promise.all(
                payloads.map(async ({ id, data }) => {
                    let item = await this.repository.findOne({
                        where: {
                            deleted_at: IsNull(),
                            kopsurat_id: id
                        }
                    });

                    if (!item) {
                        return {
                            success: false,
                            message: MessageDialog.__('error.default.notFoundItem', { item: 'Kop Surat' }),
                            record: null,
                            id
                        };
                    }

                    const updatedItem = await this.repository.save({ ...item, ...data });
                    return {
                        success: true,
                        message: MessageDialog.__('success.kopSurat.update'),
                        record: updatedItem,
                        id
                    };
                })
            );

            const failedUpdates = results.filter(result => !result.success);
            if (failedUpdates.length > 0) {
                return {
                    success: false,
                    message: MessageDialog.__('error.failed.updateKopSurat'),
                    record: failedUpdates
                };
            }

            return {
                success: true,
                message: MessageDialog.__('success.kopSurat.update'),
                record: results.map(r => r.record)
            };
        } catch (error: any) {
            return this.setupErrorMessage(error);
        }
    }
} 