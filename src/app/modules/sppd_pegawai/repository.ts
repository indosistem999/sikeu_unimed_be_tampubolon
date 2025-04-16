import { IsNull, Like } from "typeorm";
import AppDataSource from "../../../config/dbconfig";
import { SPPDPangkat } from "../../../database/models/SPPDPangkat";
import { I_RequestCustom, I_ResultService } from "../../../interfaces/app.interface";
import { I_SPPDPangkatRepository } from "../../../interfaces/sppdPangkat.interface";
import { MessageDialog } from "../../../lang";
import { I_ResponsePagination } from "../../../interfaces/pagination.interface";
import { setPagination } from "../../../lib/utils/pagination.util";
import { I_SppdPegawaiRepository } from "../../../interfaces/sppdPegawai";
import { SPPDPegawai } from "../../../database/models/SPPDPegawai";
import { snapLogActivity } from "../../../events/publishers/logUser.publisher";
import { TypeLogActivity } from "../../../lib/utils/global.util";


export class SppdPegawaiRepository implements I_SppdPegawaiRepository {
    private repository = AppDataSource.getRepository(SPPDPegawai);

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
                    pegawai_id: id
                },
            });

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'Employee' }),
                    record: result
                }
            }

            return {
                success: true,
                message: MessageDialog.__('success.sppdPegawai.fetch'),
                record: result
            }
        } catch (error: any) {
            return this.setupErrorMessage(error);
        }
    }

    /** Store Data */
    async store(req: I_RequestCustom, payload: Record<string, any>): Promise<I_ResultService> {
        try {
            const result = await this.repository.save(this.repository.create(payload))

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.failed.storeEmployee'),
                    record: result
                }
            }


            const userId: any = req?.user?.user_id
            await snapLogActivity(
                req,
                userId,
                TypeLogActivity.SppdEmployee.Label,
                TypeLogActivity.SppdEmployee.API.Create,
                payload.created_at,
                null,
                result
            )

            return {
                success: true,
                message: MessageDialog.__('success.sppdPegawai.store'),
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
                    pegawai_id: id
                }
            });

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'Employee' }),
                    record: result
                }
            }

            const updateResult = { ...result, ...payload }

            await this.repository.save(updateResult);

            const userId: any = req?.user?.user_id
            await snapLogActivity(
                req,
                userId,
                TypeLogActivity.SppdEmployee.Label,
                TypeLogActivity.SppdEmployee.API.Update,
                payload.updated_at,
                result,
                updateResult
            )

            return {
                success: true,
                message: MessageDialog.__('success.sppdPegawai.update'),
                record: {
                    pegawai_id: result?.pegawai_id,
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
                    pegawai_id: id,
                    deleted_at: IsNull()
                }
            })

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'Employee' }),
                    record: result
                }
            }

            const updateResult = {
                ...result,
                ...payload
            }

            await this.repository.save(updateResult);

            const userId: any = req?.user?.user_id
            await snapLogActivity(
                req,
                userId,
                TypeLogActivity.SppdEmployee.Label,
                TypeLogActivity.SppdEmployee.API.Delete,
                payload.deleted_at,
                result,
                updateResult
            )

            return {
                success: true,
                message: MessageDialog.__('success.sppdPegawai.softDelete'),
                record: {
                    pegawai_id: id
                }
            }
        } catch (error: any) {
            return this.setupErrorMessage(error)
        }
    }
}