import AppDataSource from '../../../config/dbconfig';
import { I_ResultService } from '../../../interfaces/app.interface';
import { IsNull, Like } from 'typeorm';
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

    /** Fetch Data */
    async fetch(filters: Record<string, any>): Promise<I_ResultService> {
        try {
            const { paging, sorting } = filters
            let whereConditions: Record<string, any>[] = []


            if (paging?.search && paging?.search != '' && paging?.search != null) {
                const searchTerm: string = paging?.search
                whereConditions = [
                    { unit_name: Like(`%${searchTerm}%`), deleted_at: IsNull() }, // Partial match
                    { unit_type: Like(`%${searchTerm}%`), deleted_at: IsNull() }, // Partial match
                    { unit_code: Like(`%${searchTerm}%`), deleted_at: IsNull() },             // Exact match
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
                message: MessageDialog.__('success.masterMenu.fetch'),
                record: pagination
            }
        } catch (error: any) {
            return this.setupErrorMessage(error)
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
            let result = await this.repository.findOne({
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

            result = { ...result, ...payload }

            await this.repository.save(result);


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
            let result = await this.repository.findOne({
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

            result = {
                ...result,
                ...payload
            }

            await this.repository.save(result);

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



}

export default UserRepository;
