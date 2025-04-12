import AppDataSource from '../../../config/dbconfig';
import { I_ResultService } from '../../../interfaces/app.interface';
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
    async store(payload: Record<string, any>): Promise<I_ResultService> {
        try {

            const result = await this.repository.save(this.repository.create(payload));

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.failed.storeUser'),
                    record: result
                }
            }

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
    async update(id: string, payload: Record<string, any>): Promise<I_ResultService> {
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

            await this.repository.save({ ...rest, ...payload });


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
    async softDelete(id: string, payload: Record<string, any>): Promise<I_ResultService> {
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

            await this.repository.save({
                ...rest,
                ...payload
            });

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



    /** Fetch Data */
    // async fetch(filters: Record<string, any>): Promise<I_ResultService> {
    //     try {
    //         const { paging, sorting } = filters
    //         let whereConditions: Record<string, any> = []

    //         // Where Condition
    //         if (paging?.search) {
    //             const searchTerm: string = paging?.search;
    //             whereConditions = [
    //                 {
    //                     role: {
    //                         role_name: Like(`%${searchTerm}%`)
    //                     },
    //                     deleted_at: IsNull()
    //                 },
    //                 {
    //                     work_unit: {
    //                         unit_name: Like(`%${searchTerm}%`)
    //                     },
    //                     deleted_at: IsNull()
    //                 },
    //                 {
    //                     email: Like(`%${searchTerm}%`),
    //                     deleted_at: IsNull()
    //                 },
    //                 {
    //                     phone_number: Like(`%${searchTerm}%`),
    //                     deleted_at: IsNull()
    //                 }
    //             ]
    //         }

    //         let [rows, count] = await this.repository.findAndCount({
    //             where: whereConditions,
    //             relations: [
    //                 'role',
    //                 'work_unit'
    //             ],
    //             select: {
    //                 user_id: true,
    //                 email: true,
    //                 first_name: true,
    //                 last_name: true,
    //                 role: {
    //                     role_id: true,
    //                     role_name: true
    //                 },
    //                 work_unit: {
    //                     unit_id: true,
    //                     unit_name: true
    //                 },
    //                 phone_number: true,
    //                 gender: true,
    //                 created_at: true
    //             },
    //             skip: paging?.skip,
    //             take: paging?.limit,
    //         })

    //         const pagination: I_ResponsePagination = setPagination(rows, count, paging?.page, paging?.limit);


    //         return {
    //             success: true,
    //             message: MessageDialog.__('success.masterMenu.fetch'),
    //             record: pagination
    //         }
    //     } catch (error: any) {
    //         return this.setupErrorMessage(error)
    //     }
    // }




}

export default UserRepository;
