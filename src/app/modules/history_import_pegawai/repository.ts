import { IsNull, Like } from "typeorm";
import AppDataSource from "../../../config/dbconfig";
import { I_RequestCustom, I_ResultService } from "../../../interfaces/app.interface";
import { MessageDialog } from "../../../lang";
import { I_ResponsePagination } from "../../../interfaces/pagination.interface";
import { setPagination } from "../../../lib/utils/pagination.util";
import { HistoryImportPegawai } from "../../../database/models/HistoryImportPegawai";


export class HistoryImportRepository {
    private repository = AppDataSource.getRepository(HistoryImportPegawai);

    setupErrorMessage(error: any): I_ResultService {
        return {
            success: false,
            message: error.message,
            record: error
        }
    }

    async fetch(req: I_RequestCustom, filters: Record<string, any>): Promise<I_ResultService> {
        try {
            const { paging, sorting } = filters
            let whereConditions: Record<string, any>[] = []
            let whereQuery: Record<string, any> = {
                deleted_at: IsNull()
            }

            const user = req?.user;

            if (!(['admin', 'developer'].includes(user?.role?.role_slug))) {
                whereQuery.executor_id = user?.user_id
            }

            if (paging?.search && paging?.search != '' && paging?.search != null) {
                const searchTerm: string = paging?.search
                whereConditions = [
                    { execute_time: searchTerm, deleted_at: IsNull(), ...whereQuery },
                    { execute_status: Like(`%${searchTerm}%`), ...whereQuery },
                ];
            }

            let [rows, count] = await this.repository.findAndCount({
                where: whereConditions?.length > 0 ? whereConditions : whereQuery,
                skip: paging?.skip,
                take: paging?.limit,
                order: sorting
            })

            const pagination: I_ResponsePagination = setPagination(rows, count, paging.page, paging.limit);


            return {
                success: true,
                message: MessageDialog.__('success.historyImportPegawai.fetch'),
                record: pagination
            }
        } catch (error: any) {
            return this.setupErrorMessage(error)
        }
    }
}