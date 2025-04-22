import { IsNull, Like } from "typeorm";
import AppDataSource from "../../../config/dbconfig";
import { I_RequestCustom, I_ResultService } from "../../../interfaces/app.interface";
import { MessageDialog } from "../../../lang";
import { I_ResponsePagination } from "../../../interfaces/pagination.interface";
import { setPagination } from "../../../lib/utils/pagination.util";
import { PaguAnggaran } from "../../../database/models/PaguAnggaran";


export class PaguAnggaranRepository {
    private repository = AppDataSource.getRepository(PaguAnggaran);

    setupErrorMessage(error: any): I_ResultService {
        return {
            success: false,
            message: error.message,
            record: error
        }
    }

    async fetch(filters: Record<string, any>): Promise<I_ResultService> {
        try {
            const { paging, sorting, queries } = filters
            let whereConditions: Record<string, any>[] = []
            let whereQuery: Record<string, any> = {
                deleted_at: IsNull()
            }

            if (queries?.budget_id && queries?.budget_id != null) {
                whereQuery.budget_year = {
                    budget_id: queries.budget_id
                }
            }

            if (queries?.unit_id && queries?.unit_id != null) {
                whereQuery.work_unit = {
                    unit_id: queries.unit_id
                }
            }


            if (paging?.search && paging?.search != '' && paging?.search != null) {
                const searchTerm: string = paging?.search
                whereConditions = [
                    { description: Like(`%${searchTerm}%`), ...whereQuery }, // Partial match
                    { kode_anggaran: Like(`%${searchTerm}%`), ...whereQuery }, // Partial match
                    { work_unit: { unit_name: Like(`%${searchTerm}%`) }, ...whereQuery },             // Exact match
                ];
            }

            let [rows, count] = await this.repository.findAndCount({
                where: whereConditions?.length > 0 ? whereConditions : whereQuery,
                relations: {
                    work_unit: true,
                    budget_year: true,
                    master_component: true,
                    master_mak: true,
                    master_output: true,
                    sumber_dana: true
                },
                select: {
                    pagu_anggaran_id: true,
                    kode_anggaran: true,
                    work_unit: {
                        unit_id: true,
                        unit_name: true
                    },
                    description: true,
                    prices: true,
                    realisasi: true,
                    sisa_anggaran: true,
                    created_at: true,
                    updated_at: true
                },
                skip: paging?.skip,
                take: paging?.limit,
                order: sorting
            })

            const pagination: I_ResponsePagination = setPagination(rows, count, paging.page, paging.limit);


            return {
                success: true,
                message: MessageDialog.__('success.paguAnggaran.fetch'),
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
                    pagu_anggaran_id: id
                },
                relations: {
                    work_unit: true,
                    budget_year: true,
                    master_component: true,
                    master_mak: true,
                    master_output: true,
                    sumber_dana: true
                },
            });

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'Pagu Anggaran' }),
                    record: result
                }
            }

            return {
                success: true,
                message: MessageDialog.__('success.paguAnggaran.fetch'),
                record: result
            }
        } catch (error: any) {
            return this.setupErrorMessage(error);
        }
    }

    async store(req: I_RequestCustom, payload: Record<string, any>): Promise<I_ResultService> {
        try {
            const result = await this.repository.save(this.repository.create(payload))

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.failed.storePaguAnggaran'),
                    record: result
                }
            }

            return {
                success: true,
                message: MessageDialog.__('success.paguAnggaran.store'),
                record: result
            }
        } catch (err: any) {
            return this.setupErrorMessage(err)
        }
    }

    async update(req: I_RequestCustom, id: string, payload: Record<string, any>): Promise<I_ResultService> {
        try {
            let result = await this.repository.findOne({
                where: {
                    deleted_at: IsNull(),
                    pagu_anggaran_id: id
                }
            });

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'Pagu Anggaran' }),
                    record: result
                }
            }

            result = { ...result, ...payload }

            await this.repository.save(result);


            return {
                success: true,
                message: MessageDialog.__('success.paguAnggaran.update'),
                record: {
                    pangkat_id: result?.pagu_anggaran_id,
                }
            }

        } catch (error: any) {
            return this.setupErrorMessage(error)
        }
    }

    async softDelete(req: I_RequestCustom, id: string, payload: Record<string, any>): Promise<I_ResultService> {
        try {
            let result = await this.repository.findOne({
                where: {
                    pagu_anggaran_id: id,
                    deleted_at: IsNull()
                }
            })

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'Pagu Anggaran' }),
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
                message: MessageDialog.__('success.paguAnggaran.softDelete'),
                record: {
                    pagu_anggaran_id: id
                }
            }
        } catch (error: any) {
            return this.setupErrorMessage(error)
        }
    }
}