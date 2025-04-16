import { IsNull, Like, Raw } from "typeorm";
import AppDataSource from "../../../config/dbconfig";
import { UserLog } from "../../../database/models/UserLog";
import { I_RequestCustom, I_ResultService } from "../../../interfaces/app.interface";
import { I_UserLogRepository } from "../../../interfaces/userLog.interface";
import { MessageDialog } from "../../../lang";
import { I_ResponsePagination } from "../../../interfaces/pagination.interface";
import { setPagination } from "../../../lib/utils/pagination.util";

class UserLogRepository implements I_UserLogRepository {
    private repository = AppDataSource.getRepository(UserLog);

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
            const defaultWhere: Record<string, any> = {
                activity_time: Raw(alias => `DATE_FORMAT(${alias}, '%Y-%m') = '${currentMonthYear}'`),
                deleted_at: IsNull(),
                user_id: req?.user?.user_id,
            }
            let whereConditions: Record<string, any>[] = []
            const currentMonthYear = new Date().toISOString().slice(0, 7);

            if (paging?.search && paging?.search != '' && paging?.search != null) {
                const searchTerm: string = paging?.search
                whereConditions = [
                    {
                        activity_type: Like(`%${searchTerm}%`),
                        ...defaultWhere
                    },
                    {
                        description: Like(`%${searchTerm}%`),
                        ...defaultWhere
                    },
                ];
            }

            let [rows, count] = await this.repository.findAndCount({
                where: whereConditions?.length > 0 ? whereConditions : defaultWhere,
                select: {
                    log_id: true,
                    activity_time: true,
                    activity_type: true,
                    description: true,
                    ip_address: true,
                    browser_name: true,
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
                message: MessageDialog.__('success.log.fetch'),
                record: pagination
            }
        } catch (err: any) {
            return this.setupErrorMessage(err)
        }
    }
}

export default UserLogRepository