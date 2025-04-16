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
import { makeFullUrlFile } from "../../../config/storages";
import { MasterWorkUnit } from "../../../database/models/MasterWorkUnit";


export class SppdPegawaiRepository implements I_SppdPegawaiRepository {
    private repository = AppDataSource.getRepository(SPPDPegawai);

    setupErrorMessage(error: any): I_ResultService {
        return {
            success: false,
            message: error.message,
            record: error
        }
    }

    whereReqQuery(queries: any): Record<string, any> {
        const whereQuery: Record<string, any> = {}

        if (queries?.unit_id) {
            whereQuery.unit_id = queries?.unit_id
        }

        if (queries?.jenis_kepegawaian && queries?.jenis_kepegawaian != 'all') {
            whereQuery.jenis_kepegawaian = queries.jenis_kepegawaian.toLowerCase()
        }

        if (queries?.status_kepegawaian && queries?.status_kepegawaian != 'all') {
            whereQuery.status_kepegawaian = queries.status_kepegawaian.toLowerCase()
        }

        if (queries?.status_active && Number(queries?.status_active) != 2) {
            whereQuery.status_active = Number(queries?.status_active)
        }

        return whereQuery
    }


    async fetch(filters: Record<string, any>): Promise<I_ResultService> {
        try {
            const { paging, sorting, queries } = filters
            const whereQuery: Record<string, any> = { ...this.whereReqQuery(queries), deleted_at: IsNull() }
            let whereConditions: Record<string, any>[] = []


            console.log(queries);

            if (paging?.search && paging?.search != '' && paging?.search != null) {
                const searchTerm: string = paging?.search
                whereConditions = [
                    { nik: Like(`%${searchTerm}%`), ...whereQuery }, // Partial match
                    { nip: Like(`%${searchTerm}%`), ...whereQuery }, // Partial match
                    { nama: Like(`%${searchTerm}%`), ...whereQuery },
                    {
                        work_unit: {
                            unit_name: Like(`%${searchTerm}%`)
                        },
                        ...whereQuery
                    },
                ];
            }

            let [rows, count] = await this.repository.findAndCount({
                where: whereConditions?.length > 0 ? whereConditions : whereQuery,
                relations: {
                    work_unit: true
                },
                select: {
                    pegawai_id: true,
                    nik: true,
                    nip: true,
                    nama: true,
                    email: true,
                    phone: true,
                    work_unit: {
                        unit_id: true,
                        unit_code: true,
                        unit_name: true,
                        unit_type: true,
                        created_at: true,
                        updated_at: true
                    },
                    gelar_depan: true,
                    jenis_kepegawaian: true,
                    status_kepegawaian: true,
                    status_active: true,
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
                relations: ["work_unit", "pangkat_golongan"],
                select: {
                    pegawai_id: true,
                    nik: true,
                    nip: true,
                    nama: true,
                    gelar_depan: true,
                    email: true,
                    phone: true,
                    photo: true,
                    unit_id: true,
                    work_unit: {
                        unit_id: true,
                        unit_name: true,
                    },
                    pangkat_id: true,
                    pangkat_golongan: {
                        pangkat_id: true,
                        pangkat: true,
                        golongan_angka: true,
                        golongan_romawi: true,
                    },
                    jenis_kepegawaian: true,
                    status_kepegawaian: true,
                    status_active: true,
                    simpeg_id: true,
                    username: true,
                    created_at: true,
                    updated_at: true
                }

            });

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'Employee' }),
                    record: result
                }
            }


            result.photo = makeFullUrlFile(result.photo, 'sppd-pegawai')

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