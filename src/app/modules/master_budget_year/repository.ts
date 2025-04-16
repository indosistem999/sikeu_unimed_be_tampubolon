import { IsNull, Like } from "typeorm";
import AppDataSource from "../../../config/dbconfig";
import { I_ResultService } from "../../../interfaces/app.interface";
import { MessageDialog } from "../../../lang";
import { I_ResponsePagination } from "../../../interfaces/pagination.interface";
import { setPagination } from "../../../lib/utils/pagination.util";
import { I_MasterBudgetYearRepository } from "../../../interfaces/masteBudgetYear.interface";
import { MasterBudgetYear } from "../../../database/models/MasterBudgetYear";



export class MasterBudgetYearRepository implements I_MasterBudgetYearRepository {
    private repository = AppDataSource.getRepository(MasterBudgetYear);

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
                    { budget_name: Like(`%${searchTerm}%`), deleted_at: IsNull() }
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
                message: MessageDialog.__('success.budgetYear.fetch'),
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
                    budget_id: id
                },
            });

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'Budget of year' }),
                    record: result
                }
            }

            return {
                success: true,
                message: MessageDialog.__('success.budgetYear.fetch'),
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
                    message: MessageDialog.__('error.failed.storeBudgetYear'),
                    record: result
                }
            }

            return {
                success: true,
                message: MessageDialog.__('success.budgetYear.store'),
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
                    budget_id: id
                }
            });

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'Budget of year' }),
                    record: result
                }
            }

            result = { ...result, ...payload }

            await this.repository.save(result);


            return {
                success: true,
                message: MessageDialog.__('success.budgetYear.update'),
                record: {
                    budget_id: result?.budget_id,
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
                    budget_id: id,
                    deleted_at: IsNull()
                }
            })

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'Budget of year' }),
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
                message: MessageDialog.__('success.budgetYear.softDelete'),
                record: {
                    budget_id: id
                }
            }
        } catch (error: any) {
            return this.setupErrorMessage(error)
        }
    }
}