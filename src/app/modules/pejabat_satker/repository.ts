import { IsNull, LessThanOrEqual, Like, MoreThanOrEqual } from "typeorm";
import AppDataSource from "../../../config/dbconfig";
import { I_ResultService } from "../../../interfaces/app.interface";
import { MessageDialog } from "../../../lang";
import { I_ResponsePagination } from "../../../interfaces/pagination.interface";
import { setPagination } from "../../../lib/utils/pagination.util";
import { I_PejabatSatkerRepository } from "../../../interfaces/pejabatSatker.interface";
import { MasterWorkUnit } from "../../../database/models/MasterWorkUnit";
import { MasterOfficers } from "../../../database/models/MasterOfficers";


export class PejabatSatkerRepository implements I_PejabatSatkerRepository {
    private repoUnit = AppDataSource.getRepository(MasterWorkUnit);
    private repoOfficer = AppDataSource.getRepository(MasterOfficers)

    setupErrorMessage(error: any): I_ResultService {
        return {
            success: false,
            message: error.message,
            record: error
        }
    }

    async fetchUnitWorkGroup(filters: Record<string, any>): Promise<I_ResultService> {
        try {
            const { paging, sorting } = filters

            const queryBuilder = this.repoUnit.createQueryBuilder('mwu')
                .leftJoinAndSelect(MasterOfficers, 'mo', 'mo.unit_id = mwu.unit_id')
                .where('mwu.deleted_at is null')
                .select([
                    'mwu.unit_id as unit_id',
                    'mwu.unit_name as unit_name',
                    'mwu.unit_code as unit_code',
                    'mwu.unit_type as unit_type',
                    'count(mo.officers_id) as total_officers'
                ])


            if (paging?.search && paging?.search != '' && paging?.search != null) {
                const searchTerm: string = paging?.search
                queryBuilder.andWhere((builder: any) => {
                    builder.where(`mwu.unit_name LIKE :searchTerm`, { serachTerm: `%${searchTerm}%` })
                        .orWhere(`mwu.unit_type LIKE :searchTerm`, { serachTerm: `%${searchTerm}%` })
                        .orWhere(`mwu.unit_code LIKE :searchTerm`, { serachTerm: `%${searchTerm}%` })
                })
            }

            if (sorting) {
                for (const [key, value] of Object.entries(sorting)) {
                    queryBuilder.addOrderBy(`${key}`, value as 'ASC' | 'DESC');
                }
            }

            const rowBuilder = queryBuilder
            const countBuilder = queryBuilder

            const rows = await rowBuilder
                .skip(paging?.skip)
                .take(paging?.limit)
                .groupBy('mwu.unit_id')
                .getRawMany()


            const totals = await countBuilder.groupBy('mwu.unit_id').getCount();

            const pagination: I_ResponsePagination = setPagination(rows, totals, paging.page, paging.limit);

            return {
                success: true,
                message: MessageDialog.__('success.workUnit.fetch'),
                record: pagination
            }
        } catch (error: any) {
            return this.setupErrorMessage(error)
        }
    }

    async fetchOfficerGroup(id: string, filters: Record<string, any>): Promise<I_ResultService> {
        try {
            const { paging, sorting, queries } = filters

            let whereConditions: Record<string, any>[] = []

            let whereQuery: Record<string, any> = {}


            if (paging?.search && paging?.search != '' && paging?.search != null) {
                const searchTerm: string = paging?.search
                whereConditions = [
                    { nip: Like(`%${searchTerm}%`), deleted_at: IsNull() },
                    { full_name: Like(`%${searchTerm}%`), deleted_at: IsNull() },
                    { posititon_name: Like(`%${searchTerm}%`), deleted_at: IsNull() },
                    { position_type: Like(`%${searchTerm}%`), deleted_at: IsNull() },
                ];
            }

            if (queries?.job_category_id) {
                whereQuery = {
                    ...whereQuery,
                    job_category: {
                        job_category_id: queries?.job_category_id
                    }
                }
            }


            if (queries?.start_date_position && queries?.end_date_position) {
                whereQuery = {
                    ...whereQuery,
                    start_date_position: MoreThanOrEqual(queries.start_date_position),
                    end_date_position: LessThanOrEqual(queries.end_date_position)
                }
            } else if (queries?.start_date_position) {
                whereQuery = {
                    ...whereQuery,
                    start_date_position: MoreThanOrEqual(queries.start_date_position)
                }
            }

            const [rows, count] = await this.repoOfficer.findAndCount({
                where: {
                    deleted_at: IsNull(),
                    unit_id: id,
                    ...whereConditions,
                    ...whereQuery
                },
                relations: {
                    job_category: true
                },
                skip: paging?.skip,
                take: paging?.limit,
                order: sorting
            });

            const pagination: I_ResponsePagination = setPagination(rows, count, paging.page, paging.limit);

            return {
                success: true,
                message: MessageDialog.__('success.masterOfficer.fetch'),
                record: pagination
            }

        } catch (error: any) {
            return this.setupErrorMessage(error);
        }
    }

}