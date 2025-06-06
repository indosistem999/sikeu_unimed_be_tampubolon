import AppDataSource from '../../../config/dbconfig';
import { I_RequestCustom, I_ResultService } from '../../../interfaces/app.interface';
import { Brackets, IsNull, Like } from 'typeorm';
import { MessageDialog } from '../../../lang';
import { I_UserRepository } from '../../../interfaces/user.interface';
import { I_ResponsePagination } from '../../../interfaces/pagination.interface';
import { setPagination } from '../../../lib/utils/pagination.util';
import { Users } from '../../../database/models/Users';
import { allSchema as sc } from '../../../constanta';
import { Roles } from '../../../database/models/Roles';
import { makeFullUrlFile } from '../../../config/storages';
import { MasterWorkUnit } from '../../../database/models/MasterWorkUnit';
import { snapLogActivity } from '../../../events/publishers/logUser.publisher';
import { NotificationOption, NotificationType, TypeLogActivity } from '../../../lib/utils/global.util';
import { eventPublishNotification } from '../../../events/publishers/notification.publisher';
import { I_AuthUserPayload } from '../../../interfaces/auth.interface';
import { generatedToken } from '../../../lib/utils/jwt.util';
import { generateSalt, hashedPassword } from '../../../lib/utils/bcrypt.util';

class UserRepository implements I_UserRepository {
    private repository = AppDataSource.getRepository(Users);

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

            const queryBuilder = this.repository.createQueryBuilder("user")
                .leftJoinAndSelect("user.role", "role")
                .leftJoinAndSelect("user.work_unit", "work_unit");

            // Where Condition
            if (paging?.search) {
                const searchTerm: string = `%${paging.search}%`;
                queryBuilder.andWhere(
                    new Brackets(qb => {
                        qb.where("concat(user.first_name, ' ', user.last_name) LIKE :searchTerm", { searchTerm })
                            .orWhere("role.role_name LIKE :searchTerm", { searchTerm })
                            .orWhere("work_unit.unit_name LIKE :searchTerm", { searchTerm })
                            .orWhere("user.email LIKE :searchTerm", { searchTerm })
                            .orWhere("user.phone_number LIKE :searchTerm", { searchTerm })
                            .orWhere("user.gender LIKE :searchTerm", { searchTerm });
                    })
                ).andWhere("user.deleted_at IS NULL");
            }

            // Select fields
            queryBuilder.select([
                "user.user_id",
                "user.email",
                "user.first_name",
                "user.last_name",
                "user.phone_number",
                "user.gender",
                "user.created_at",
                "role.role_id",
                "role.role_name",
                "work_unit.unit_id",
                "work_unit.unit_name",
                'CONCAT(user.first_name, " ", user.last_name) as "full_name"'
            ]);

            // queryBuilder.addSelect("CONCAT(user.first_name, ' ', user.last_name)", 'full_name')

            // queryBuilder.addSelect("CONCAT(user.first_name, ' ', user.last_name)", 'full_name')

            if (sorting) {
                for (const [key, value] of Object.entries(sorting)) {
                    queryBuilder.addOrderBy(key, value as 'ASC' | 'DESC');
                }
            }

            // Pagination
            if (paging?.limit) {
                queryBuilder.take(paging.limit);
            }
            if (paging?.skip) {
                queryBuilder.skip(paging.skip);
            }

            const [rows, count] = await queryBuilder.getManyAndCount();

            const pagination: I_ResponsePagination = setPagination(rows, count, paging?.page, paging?.limit);

            return {
                success: true,
                message: MessageDialog.__('success.masterMenu.fetch'),
                record: pagination
            };
        } catch (error: any) {
            return this.setupErrorMessage(error);
        }
    }



    /** Fetch By Id */
    async fetchById(id: string): Promise<I_ResultService> {
        try {

            const result = await this.repository.createQueryBuilder(sc.user.tableName)
                .leftJoin(Roles, sc.role.tableName, `${sc.role.tableName}.${sc.role.primaryKey} = ${sc.user.tableName}.${sc.role.primaryKey}`)
                .leftJoin(MasterWorkUnit, sc.work_unit.tableName, `${sc.work_unit.tableName}.${sc.work_unit.primaryKey} = ${sc.user.tableName}.${sc.work_unit.primaryKey}`)
                .where(`${sc.user.tableName}.deleted_at IS NULL`)
                .andWhere(`${sc.user.tableName}.${sc.user.primaryKey} = :id`, { id })
                .select([
                    `${sc.user.tableName}.${sc.user.primaryKey}`,
                    `${sc.user.tableName}.first_name`,
                    `${sc.user.tableName}.last_name`,
                    `CONCAT(${sc.user.tableName}.first_name, ' ', ${sc.user.tableName}.last_name) as name`,
                    `${sc.user.tableName}.email`,
                    `${sc.user.tableName}.nip`,
                    `${sc.user.tableName}.job_position`,
                    `${sc.user.tableName}.start_work_at`,
                    `${sc.user.tableName}.end_work_at`,
                    `${sc.user.tableName}.photo`,
                    `${sc.user.tableName}.phone_number`,
                    `${sc.user.tableName}.gender`,
                    `${sc.user.tableName}.has_work_unit`,
                    `(
                        CASE
                            WHEN ${sc.user.tableName}.${sc.role.primaryKey} IS NULL
                            THEN NULL
                            ELSE JSON_OBJECT(
                                'role_id', ${sc.role.tableName}.${sc.role.primaryKey}, 
                                'role_name', ${sc.role.tableName}.role_name, 
                                'role_slug', ${sc.role.tableName}.role_slug, 
                                'created_at', ${sc.role.tableName}.created_at, 
                                'created_by', ${sc.role.tableName}.created_by 
                            )
                        END
                    ) AS role`,
                    `(
                        CASE
                            WHEN ${sc.user.tableName}.${sc.work_unit.primaryKey} IS NULL
                            THEN NULL
                            ELSE JSON_OBJECT(
                                'user_id', ${sc.work_unit.tableName}.${sc.work_unit.primaryKey}, 
                                'unit_name', ${sc.work_unit.tableName}.unit_name, 
                                'unit_code', ${sc.work_unit.tableName}.unit_code, 
                                'unit_type', ${sc.work_unit.tableName}.unit_type, 
                                'created_at', ${sc.work_unit.tableName}.created_at, 
                                'created_by', ${sc.work_unit.tableName}.created_by 
                            )
                        END
                    ) AS work_unit`
                ])
                .getRawOne();


            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'user' }),
                    record: result
                }
            }

            result.photo = makeFullUrlFile(result?.photo)

            return {
                success: true,
                message: MessageDialog.__('success.user.fetch'),
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
                    message: MessageDialog.__('error.failed.storeUser'),
                    record: result
                }
            }

            // Log Activity
            const userId: any = req?.user?.user_id
            await snapLogActivity(
                req,
                userId,
                TypeLogActivity.Users.Label,
                TypeLogActivity.Users.API.Create,
                payload.created_at,
                null,
                result
            )


            // Notification
            await eventPublishNotification(
                req?.user,
                NotificationOption.Users.Topic,
                NotificationOption.Users.Event.Create(`${payload.first_name} ${payload.last_name}`),
                NotificationType.Information,
                payload.created_at,
                result
            )


            return {
                success: true,
                message: MessageDialog.__('success.user.store'),
                record: {
                    user_id: result.user_id
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
                    user_id: id
                }
            });

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'user' }),
                    record: result
                }
            }


            const { full_name, ...rest } = result;
            const updateResult = { ...rest, ...payload }
            await this.repository.save(updateResult);


            const userId: any = req?.user?.user_id
            await snapLogActivity(
                req,
                userId,
                TypeLogActivity.Users.Label,
                TypeLogActivity.Users.API.Update,
                payload.updated_at,
                rest,
                updateResult
            )


            // Notification
            await eventPublishNotification(
                req?.user,
                NotificationOption.Users.Topic,
                NotificationOption.Users.Event.Update(full_name),
                NotificationType.Information,
                payload.updated_at,
                updateResult
            )


            return {
                success: true,
                message: MessageDialog.__('success.user.update'),
                record: {
                    user_id: result?.user_id,
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
                    user_id: id,
                    deleted_at: IsNull()
                }
            })

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'user' }),
                    record: result
                }
            }

            const { full_name, ...rest } = result
            const updateResult = {
                ...rest,
                ...payload
            }
            await this.repository.save(updateResult);


            const userId: any = req?.user?.user_id
            await snapLogActivity(
                req,
                userId,
                TypeLogActivity.Users.Label,
                TypeLogActivity.Users.API.Delete,
                payload.deleted_at,
                rest,
                updateResult
            )


            // Notification
            await eventPublishNotification(
                req?.user,
                NotificationOption.Users.Topic,
                NotificationOption.Users.Event.Delete(full_name),
                NotificationType.Information,
                payload.deleted_at,
                updateResult
            )

            return {
                success: true,
                message: MessageDialog.__('success.user.softDelete'),
                record: {
                    user_id: id
                }
            }
        } catch (error: any) {
            return this.setupErrorMessage(error)
        }
    }


    async loginAs(req: I_RequestCustom, id: string, payload: Record<string, any>): Promise<I_ResultService> {
        try {
            const user = await this.repository.findOne({
                where: {
                    deleted_at: IsNull(),
                    user_id: id
                },
                relations: ['role']
            });

            if (!user) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'User' }),
                    record: payload,
                };
            }


            await this.repository.save({
                ...user,
                last_ip: payload?.request_ip,
                last_hostname: payload?.request_host,
                last_login: payload?.last_login
            })


            // Create JWT Payload and Generate Token Access
            const jwtPayload: I_AuthUserPayload = {
                user_id: user.user_id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: {
                    role_id: user.role?.role_id,
                    role_name: user.role?.role_name,
                    role_slug: user.role?.role_slug,
                }
            };

            const access_token = generatedToken(jwtPayload);
            const refresh_token = generatedToken(jwtPayload, '7d');

            // Log Acctivity
            await snapLogActivity(
                req,
                req?.user?.user_id as string,
                TypeLogActivity.Users.Label,
                TypeLogActivity.Users.API.LoginAs(
                    `${req?.user?.first_name} ${req?.user?.last_name}`,
                    `${user?.first_name} ${user?.last_name}`
                ),
                payload?.last_login,
                null,
                { access_token, refresh_token, user },
            )

            // Notification
            await eventPublishNotification(
                req?.user,
                NotificationOption.Users.Topic,
                NotificationOption.Users.Event.LoginAs(
                    `${req?.user?.first_name} ${req?.user?.last_name}`
                ),
                NotificationType.Information,
                payload?.last_login,
                { access_token, refresh_token, user },
                [user?.user_id]
            )

            return {
                success: true,
                message: MessageDialog.__('success.auth.login'),
                record: {
                    access_token,
                    refresh_token,
                },
            };

        } catch (error: any) {
            return this.setupErrorMessage(error)
        }
    }

    async changePassword(req: I_RequestCustom, id: string, payload: Record<string, any>): Promise<I_ResultService> {
        try {
            const user = await this.repository.findOne({
                where: { user_id: id, deleted_at: IsNull() }
            })

            if (!user) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'User' }),
                    record: user,
                };
            }

            const userName: string = `${user.first_name} ${user.last_name}`

            const salt = await generateSalt();
            user.password = await hashedPassword(payload.new_password, salt);
            user.salt = salt;
            user.updated_at = payload?.updated_at;
            user.password_change_at = payload?.updated_at;
            user.updated_by = user.user_id;

            await this.repository.save(user);

            // Log Activity
            await snapLogActivity(
                req,
                user.user_id,
                TypeLogActivity.Users.Label,
                TypeLogActivity.Users.API.ChangePassword,
                payload.updated_at
            )

            // Notification
            await eventPublishNotification(
                req?.user,
                NotificationOption.Users.Topic,
                NotificationOption.Users.Event.ChangePassword(userName),
                NotificationType.Information,
                payload.updated_at,
                user,
                [id]
            )

            return {
                success: true,
                message: MessageDialog.__('success.auth.changePassword'),
                record: {
                    user_id: user.user_id,
                },
            };

        } catch (error: any) {
            return this.setupErrorMessage(error)
        }
    }


}

export default UserRepository;
