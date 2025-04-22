import { IsNull, Like } from "typeorm";
import AppDataSource from "../../../config/dbconfig";
import { I_RequestCustom, I_ResultService } from "../../../interfaces/app.interface";
import { MessageDialog } from "../../../lang";
import { I_ResponsePagination } from "../../../interfaces/pagination.interface";
import { setPagination } from "../../../lib/utils/pagination.util";
import { snapLogActivity } from "../../../events/publishers/logUser.publisher";
import { NotificationOption, NotificationType, TypeLogActivity } from "../../../lib/utils/global.util";
import { eventPublishNotification } from "../../../events/publishers/notification.publisher";
import { MasterDataMAK } from "../../../database/models/MasterDataMAK";


export class MasterDataMAKRepository {
    private repository = AppDataSource.getRepository(MasterDataMAK);

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
                    { code: Like(`%${searchTerm}%`), deleted_at: IsNull() }, // Partial match
                    { description: Like(`%${searchTerm}%`), deleted_at: IsNull() },            // Exact match
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
                message: MessageDialog.__('success.masterDataMAK.fetch'),
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
                    mak_id: id
                },
            });

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'MAK id' }),
                    record: result
                }
            }

            return {
                success: true,
                message: MessageDialog.__('success.masterDataMAK.fetch'),
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
                    message: MessageDialog.__('error.failed.storeDataMAK'),
                    record: result
                }
            }

            // Log Activity
            const userId: any = req?.user?.user_id
            await snapLogActivity(
                req,
                userId,
                TypeLogActivity.MasterDataMAK.Label,
                TypeLogActivity.MasterDataMAK.API.Create,
                payload.created_at,
                null,
                result
            )


            // Notification
            await eventPublishNotification(
                req?.user,
                NotificationOption.MasterDataMAK.Topic,
                NotificationOption.MasterDataMAK.Event.Create(result?.code),
                NotificationType.Information,
                payload.created_at,
                result
            )


            return {
                success: true,
                message: MessageDialog.__('success.masterDataMAK.store'),
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
                    mak_id: id
                }
            });

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'Data MAK' }),
                    record: result
                }
            }

            const codeName: string = result?.code;

            const updateResult = { ...result, ...payload }
            await this.repository.save(updateResult);

            // Log Activity
            const userId: any = req?.user?.user_id
            await snapLogActivity(
                req,
                userId,
                TypeLogActivity.MasterDataMAK.Label,
                TypeLogActivity.MasterDataMAK.API.Update,
                payload.updated_at,
                result,
                updateResult
            )


            // Notification
            await eventPublishNotification(
                req?.user,
                NotificationOption.MasterDataMAK.Topic,
                NotificationOption.MasterDataMAK.Event.Update(codeName),
                NotificationType.Information,
                payload.updated_at,
                updateResult
            )


            return {
                success: true,
                message: MessageDialog.__('success.masterDataMAK.update'),
                record: {
                    mak_id: result?.mak_id,
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
                    mak_id: id,
                    deleted_at: IsNull()
                }
            })

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'Data MAK id' }),
                    record: result
                }
            }

            const codeName: string = result?.code

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
                TypeLogActivity.MasterDataMAK.Label,
                TypeLogActivity.MasterDataMAK.API.Delete,
                payload.deleted_at,
                result,
                updateResult
            )


            // Notification
            await eventPublishNotification(
                req?.user,
                NotificationOption.MasterDataMAK.Topic,
                NotificationOption.MasterDataMAK.Event.Delete(codeName),
                NotificationType.Information,
                payload.deleted_at,
                updateResult
            )

            return {
                success: true,
                message: MessageDialog.__('success.masterDataMAK.softDelete'),
                record: {
                    mak_id: id
                }
            }
        } catch (error: any) {
            return this.setupErrorMessage(error)
        }
    }

    async batchDelete(req: I_RequestCustom, data: Record<string, any>): Promise<I_ResultService> {
        const { list_mak, ...payload } = data;

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const listId = list_mak.map((item: any) => item.mak_id)
            const results = await this.repository.createQueryBuilder()
                .update()
                .where('mak_id in(:...listId)', { listId })
                .andWhere('deleted_at is null')
                .set({
                    ...payload
                })
                .execute()

            if (!results) {
                await queryRunner.rollbackTransaction();
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'Data MAK id' }),
                    record: results
                }
            }

            await queryRunner.commitTransaction();

            // Log Activity
            const userId: any = req?.user?.user_id
            await snapLogActivity(
                req,
                userId,
                TypeLogActivity.MasterDataMAK.Label,
                TypeLogActivity.MasterDataMAK.API.BatchDelete,
                payload.deleted_at,
                null,
                list_mak
            )


            // Notification
            await eventPublishNotification(
                req?.user,
                NotificationOption.MasterDataMAK.Topic,
                NotificationOption.MasterDataMAK.Event.BatchDelete,
                NotificationType.Information,
                payload.deleted_at,
                list_mak
            )

            return {
                success: true,
                message: MessageDialog.__('success.masterDataMAK.softDelete'),
                record: listId
            }
        } catch (error: any) {
            await queryRunner.rollbackTransaction();
            return this.setupErrorMessage(error)
        } finally {
            await queryRunner.release();
        }
    }
}