import { IsNull, Like } from "typeorm";
import AppDataSource from "../../../config/dbconfig";
import { SPPDPangkat } from "../../../database/models/SPPDPangkat";
import { I_ResultService } from "../../../interfaces/app.interface";
import { I_SPPDPangkatRepository } from "../../../interfaces/sppdPangkat.interface";
import { MessageDialog } from "../../../lang";
import { I_ResponsePagination } from "../../../interfaces/pagination.interface";
import { setPagination } from "../../../lib/utils/pagination.util";


export class SPPDPangkatRepository implements I_SPPDPangkatRepository {
    private repository = AppDataSource.getRepository(SPPDPangkat);

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
                    { golongan_romawi: Like(`%${searchTerm}%`), deleted_at: IsNull() }, // Partial match
                    { golongan_angka: Like(`%${searchTerm}%`), deleted_at: IsNull() }, // Partial match
                    { pangkat: Like(`%${searchTerm}%`), deleted_at: IsNull() },             // Exact match
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
                message: MessageDialog.__('success.sppdPangkat.fetch'),
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
                    pangkat_id: id
                },
            });

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'Sppd Pangkat' }),
                    record: result
                }
            }

            return {
                success: true,
                message: MessageDialog.__('success.sppdPangkat.fetch'),
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
                    message: MessageDialog.__('error.failed.storeSppdPangkat'),
                    record: result
                }
            }

            return {
                success: true,
                message: MessageDialog.__('success.sppdPangkat.store'),
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
                    pangkat_id: id
                }
            });

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'Sppd Pangkat' }),
                    record: result
                }
            }

            result = { ...result, ...payload }

            await this.repository.save(result);


            return {
                success: true,
                message: MessageDialog.__('success.sppdPangkat.update'),
                record: {
                    pangkat_id: result?.pangkat_id,
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
                    pangkat_id: id,
                    deleted_at: IsNull()
                }
            })

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'Sppd Pangkat' }),
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
                message: MessageDialog.__('success.sppdPangkat.softDelete'),
                record: {
                    pangkat_id: id
                }
            }
        } catch (error: any) {
            return this.setupErrorMessage(error)
        }
    }
}