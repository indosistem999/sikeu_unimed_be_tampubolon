import { IsNull, Like } from "typeorm";
import AppDataSource from "../../../config/dbconfig";
import { I_RequestCustom, I_ResultService } from "../../../interfaces/app.interface";
import { MessageDialog } from "../../../lang";
import { I_ResponsePagination } from "../../../interfaces/pagination.interface";
import { setPagination } from "../../../lib/utils/pagination.util";
import { snapLogActivity } from "../../../events/publishers/logUser.publisher";
import { NotificationOption, NotificationType, TypeLogActivity } from "../../../lib/utils/global.util";
import { eventPublishNotification } from "../../../events/publishers/notification.publisher";
import { MasterDataComponent } from "../../../database/models/MasterDataComponent";


export class MasterDataComponentRepository {
    private repository = AppDataSource.getRepository(MasterDataComponent);

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
                message: MessageDialog.__('success.masterDataComponent.fetch'),
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
                    component_id: id
                },
            });

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'Component id' }),
                    record: result
                }
            }

            return {
                success: true,
                message: MessageDialog.__('success.masterDataComponent.fetch'),
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
                    message: MessageDialog.__('error.failed.storeDataComponent'),
                    record: result
                }
            }

            // Log Activity
            const userId: any = req?.user?.user_id
            await snapLogActivity(
                req,
                userId,
                TypeLogActivity.MasterDataComponent.Label,
                TypeLogActivity.MasterDataComponent.API.Create,
                payload.created_at,
                null,
                result
            )


            // Notification
            await eventPublishNotification(
                req?.user,
                NotificationOption.MasterDataComponent.Topic,
                NotificationOption.MasterDataComponent.Event.Create(result?.code),
                NotificationType.Information,
                payload.created_at,
                result
            )


            return {
                success: true,
                message: MessageDialog.__('success.masterDataComponent.store'),
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
                    component_id: id
                }
            });

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'Component' }),
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
                TypeLogActivity.MasterDataComponent.Label,
                TypeLogActivity.MasterDataComponent.API.Update,
                payload.updated_at,
                result,
                updateResult
            )


            // Notification
            await eventPublishNotification(
                req?.user,
                NotificationOption.MasterDataComponent.Topic,
                NotificationOption.MasterDataComponent.Event.Update(codeName),
                NotificationType.Information,
                payload.updated_at,
                updateResult
            )


            return {
                success: true,
                message: MessageDialog.__('success.masterDataComponent.update'),
                record: {
                    component_id: result?.component_id,
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
                    component_id: id,
                    deleted_at: IsNull()
                }
            })

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'Data component id' }),
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
                TypeLogActivity.MasterDataComponent.Label,
                TypeLogActivity.MasterDataComponent.API.Delete,
                payload.deleted_at,
                result,
                updateResult
            )


            // Notification
            await eventPublishNotification(
                req?.user,
                NotificationOption.MasterDataComponent.Topic,
                NotificationOption.MasterDataComponent.Event.Delete(codeName),
                NotificationType.Information,
                payload.deleted_at,
                updateResult
            )

            return {
                success: true,
                message: MessageDialog.__('success.masterDataComponent.softDelete'),
                record: {
                    component_id: id
                }
            }
        } catch (error: any) {
            return this.setupErrorMessage(error)
        }
    }

    async batchDelete(req: I_RequestCustom, data: Record<string, any>): Promise<I_ResultService> {
        const { list_component, ...payload } = data;

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const listId = list_component.map((item: any) => item.component_id)
            const results = await this.repository.createQueryBuilder()
                .update()
                .where('component_id in(:...listId)', { listId })
                .andWhere('deleted_at is null')
                .set({
                    ...payload
                })
                .execute()

            if (!results) {
                await queryRunner.rollbackTransaction();
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'Data component id' }),
                    record: results
                }
            }

            await queryRunner.commitTransaction();

            // Log Activity
            const userId: any = req?.user?.user_id
            await snapLogActivity(
                req,
                userId,
                TypeLogActivity.MasterDataComponent.Label,
                TypeLogActivity.MasterDataComponent.API.BatchDelete,
                payload.deleted_at,
                null,
                list_component
            )


            // Notification
            await eventPublishNotification(
                req?.user,
                NotificationOption.MasterDataComponent.Topic,
                NotificationOption.MasterDataComponent.Event.BatchDelete,
                NotificationType.Information,
                payload.deleted_at,
                list_component
            )

            return {
                success: true,
                message: MessageDialog.__('success.masterDataComponent.softDelete'),
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