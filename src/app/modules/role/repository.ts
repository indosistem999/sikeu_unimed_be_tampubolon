import { IsNull, Like } from 'typeorm';
import { Roles } from '../../../database/models/Roles';
import { I_RequestCustom, I_ResultService } from '../../../interfaces/app.interface';
import { I_RoleRepository } from '../../../interfaces/role.interface';

import { MessageDialog } from '../../../lang';
import { I_ResponsePagination } from '../../../interfaces/pagination.interface';
import { setPagination } from '../../../lib/utils/pagination.util';
import AppDataSource from '../../../config/dbconfig';
import { snapLogActivity } from '../../../events/publishers/logUser.publisher';
import { NotificationOption, NotificationType, TypeLogActivity } from '../../../lib/utils/global.util';
import { eventPublishNotification } from '../../../events/publishers/notification.publisher';

class RoleRepository implements I_RoleRepository {
    private repository = AppDataSource.getRepository(Roles);

    setupErrorMessage(error: any): I_ResultService {
        return {
            success: false,
            message: error.message,
            record: error
        }
    }

    async fetchOneByParam(condition: Record<string, any>): Promise<I_ResultService> {
        try {
            const result = await this.repository.findOne({ ...condition })

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'Role name' }),
                    record: result
                }
            }

            return {
                success: true,
                message: MessageDialog.__('success.role.findItem', { item: result.role_name }),
                record: result
            }
        } catch (err: any) {
            return this.setupErrorMessage(err)
        }
    }

    async fetch(filters: Record<string, any>): Promise<I_ResultService> {
        try {
            const { paging, sorting } = filters;

            let whereCondition: Record<string, any>[] = [];

            if (paging?.search) {
                const searchTerm: any = paging?.search
                whereCondition = [
                    {
                        role_name: Like(`%${searchTerm}%`)
                    },
                    {
                        role_slug: Like(`%${searchTerm}%`)
                    }
                ]
            }


            const [rows, count] = await this.repository.findAndCount({
                where: whereCondition,
                select: {
                    role_id: true,
                    role_name: true,
                    role_slug: true,
                    created_at: true,
                    updated_at: true
                },
                skip: Number(paging?.skip),
                take: Number(paging?.limit),
                order: sorting
            });


            const pagination: I_ResponsePagination = setPagination(rows, count, paging?.page, paging?.limit);

            return {
                success: true,
                message: MessageDialog.__('success.role.fetch'),
                record: pagination
            }
        } catch (error: any) {
            return this.setupErrorMessage(error)
        }
    }

    /** Fetch By Id */
    async fetchById(id: string): Promise<I_ResultService> {
        try {
            const result = await this.repository.findOne({
                where: {
                    deleted_at: IsNull(),
                    role_id: id
                },
                select: {
                    role_id: true,
                    role_name: true,
                    role_slug: true,
                    created_at: true,
                    updated_at: true
                }
            })


            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'role' }),
                    record: result
                }
            }

            return {
                success: true,
                message: MessageDialog.__('success.role.fetch'),
                record: result
            }
        } catch (error: any) {
            return this.setupErrorMessage(error);
        }
    }

    /** Store Data */
    async store(req: I_RequestCustom, payload: Record<string, any>): Promise<I_ResultService> {
        try {

            const result = await this.repository.save(this.repository.create(payload));

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.failed.storeRole'),
                    record: result
                }
            }

            // Log Activity
            const userId: any = req?.user?.user_id
            await snapLogActivity(
                req,
                userId,
                TypeLogActivity.Role.Label,
                TypeLogActivity.Role.API.Create,
                payload.created_at,
                null,
                result
            )


            // Notification
            await eventPublishNotification(
                req?.user,
                NotificationOption.Role.Topic,
                NotificationOption.Role.Event.Create(payload?.role_name),
                NotificationType.Information,
                payload.created_at,
                result
            )

            return {
                success: true,
                message: MessageDialog.__('success.role.store'),
                record: {
                    role_id: result.role_id
                }
            }
        } catch (error: any) {
            return this.setupErrorMessage(error)
        }
    }

    /** Update Data By Id */
    async update(req: I_RequestCustom, id: string, payload: Record<string, any>): Promise<I_ResultService> {
        try {
            const result = await this.repository.findOne({
                where: {
                    deleted_at: IsNull(),
                    role_id: id
                }
            });

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'role' }),
                    record: result
                }
            }

            const roleName: string = result?.role_name

            const updateResult = { ...result, ...payload }
            await this.repository.save(updateResult);


            // Log Activity
            const userId: any = req?.user?.user_id
            await snapLogActivity(
                req,
                userId,
                TypeLogActivity.Role.Label,
                TypeLogActivity.Role.API.Update,
                payload.updated_at,
                result,
                updateResult
            )


            // Notification
            await eventPublishNotification(
                req?.user,
                NotificationOption.Role.Topic,
                NotificationOption.Role.Event.Update(roleName),
                NotificationType.Information,
                payload.updated_at,
                updateResult
            )



            return {
                success: true,
                message: MessageDialog.__('success.role.update'),
                record: {
                    role_id: result?.role_id,
                }
            }

        } catch (error: any) {
            return this.setupErrorMessage(error)
        }
    }

    /** Soft Delete Data By Id */
    async softDelete(req: I_RequestCustom, id: string, payload: Record<string, any>): Promise<I_ResultService> {
        try {
            const result = await this.repository.findOne({
                where: {
                    role_id: id,
                    deleted_at: IsNull()
                }
            })

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'role' }),
                    record: result
                }
            }

            const roleName: string = result?.role_name

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
                TypeLogActivity.Role.Label,
                TypeLogActivity.Role.API.Delete,
                payload.deleted_at,
                result,
                updateResult
            )


            // Notification
            await eventPublishNotification(
                req?.user,
                NotificationOption.Role.Topic,
                NotificationOption.Role.Event.Delete(roleName),
                NotificationType.Information,
                payload.deleted_at,
                updateResult
            )

            return {
                success: true,
                message: MessageDialog.__('success.role.softDelete'),
                record: {
                    role_id: id
                }
            }
        } catch (error: any) {
            return this.setupErrorMessage(error)
        }
    }
}

export default RoleRepository;
