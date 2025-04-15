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
                    'mwu.unit_id',
                    'mwu.unit_name',
                    'mwu.unit_code',
                    'mwu.unit_type',
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

            queryBuilder.skip(paging?.skip).take(paging?.limit)

            if (sorting && sorting?.length > 0) {
                sorting.forEach((sort: any) => {
                    queryBuilder.addOrderBy(`$${sort.column}`, sort.order);
                });
            }


            const [rows, count] = await queryBuilder.groupBy('mwu.unit_id').getManyAndCount()

            const pagination: I_ResponsePagination = setPagination(rows, count, paging.page, paging.limit);

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