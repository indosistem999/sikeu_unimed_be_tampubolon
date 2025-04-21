import { IsNull, Like } from "typeorm";
import AppDataSource from "../../../config/dbconfig";
import { I_RequestCustom, I_ResultService } from "../../../interfaces/app.interface";
import { MessageDialog } from "../../../lang";
import { I_ResponsePagination } from "../../../interfaces/pagination.interface";
import { setPagination } from "../../../lib/utils/pagination.util";
import { I_MasterJobCategoryRepository } from "../../../interfaces/masterJobCategory.interface";
import { MasterJobCategory } from "../../../database/models/MasterJobCategory";
import { snapLogActivity } from "../../../events/publishers/logUser.publisher";
import { NotificationOption, NotificationType, TypeLogActivity } from "../../../lib/utils/global.util";
import { eventPublishNotification } from "../../../events/publishers/notification.publisher";


export class MasterJobCategoryRepository implements I_MasterJobCategoryRepository {
    private repository = AppDataSource.getRepository(MasterJobCategory);

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
                    { code: Like(`%${searchTerm}%`), deleted_at: IsNull() },
                    { name: Like(`%${searchTerm}%`), deleted_at: IsNull() },
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
                message: MessageDialog.__('success.jobCategory.fetch'),
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
                    job_category_id: id
                },
            });

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'Job Category' }),
                    record: result
                }
            }

            return {
                success: true,
                message: MessageDialog.__('success.jobCategory.fetch'),
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
                    message: MessageDialog.__('error.failed.storeJobCategory'),
                    record: result
                }
            }

            // Log Activity
            const userId: any = req?.user?.user_id
            await snapLogActivity(
                req,
                userId,
                TypeLogActivity.JobCategory.Label,
                TypeLogActivity.JobCategory.API.Create,
                payload.created_at,
                null,
                result
            )

            // Notification
            await eventPublishNotification(
                req?.user,
                NotificationOption.JobCategory.Topic,
                NotificationOption.JobCategory.Event.Create(result.name),
                NotificationType.Information,
                payload.created_at,
                result
            )

            return {
                success: true,
                message: MessageDialog.__('success.jobCategory.store'),
                record: result
            }
        } catch (err: any) {
            return this.setupErrorMessage(err)
        }
    }

    async update(req: I_RequestCustom, id: string, payload: Record<string, any>): Promise<I_ResultService> {
        try {
            const result = await this.repository.findOne({
                where: {
                    deleted_at: IsNull(),
                    job_category_id: id
                }
            });

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'Job category' }),
                    record: result
                }
            }

            const jobName: string = result.name

            const updateResult = { ...result, ...payload }

            await this.repository.save(updateResult);

            // Log Activity
            const userId: any = req?.user?.user_id
            await snapLogActivity(
                req,
                userId,
                TypeLogActivity.JobCategory.Label,
                TypeLogActivity.JobCategory.API.Update,
                payload.updated_at,
                result,
                updateResult
            )

            // Notification
            await eventPublishNotification(
                req?.user,
                NotificationOption.JobCategory.Topic,
                NotificationOption.JobCategory.Event.Update(jobName),
                NotificationType.Information,
                payload.updated_at,
                updateResult
            )

            return {
                success: true,
                message: MessageDialog.__('success.storeJobCategory.update'),
                record: {
                    job_category_id: result?.job_category_id,
                }
            }

        } catch (error: any) {
            return this.setupErrorMessage(error)
        }
    }

    async softDelete(req: I_RequestCustom, id: string, payload: Record<string, any>): Promise<I_ResultService> {
        try {
            const result = await this.repository.findOne({
                where: {
                    job_category_id: id,
                    deleted_at: IsNull()
                }
            })

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'Job category' }),
                    record: result
                }
            }

            const jobName: string = result.name;

            const updateResult = {
                ...result,
                ...payload
            }

            await this.repository.save(updateResult);

            // Log Activity
            const userId: any = req?.user?.user_id
            await snapLogActivity(
                req,
                userId,
                TypeLogActivity.JobCategory.Label,
                TypeLogActivity.JobCategory.API.Delete,
                payload.deleted_at,
                result,
                updateResult
            )


            // Notification
            await eventPublishNotification(
                req?.user,
                NotificationOption.JobCategory.Topic,
                NotificationOption.JobCategory.Event.Delete(jobName),
                NotificationType.Information,
                payload.deleted_at,
                updateResult
            )

            return {
                success: true,
                message: MessageDialog.__('success.jobCategory.softDelete'),
                record: {
                    job_category_id: id
                }
            }
        } catch (error: any) {
            return this.setupErrorMessage(error)
        }
    }
}