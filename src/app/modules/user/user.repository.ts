import AppDataSource from '../../../config/dbconfig';
import { I_ResultService } from '../../../interfaces/app.interface';
import { IsNull, Like } from 'typeorm';
import { MessageDialog } from '../../../lang';
import { I_UserRepository } from '../../../interfaces/user.interface';
import { MasterWorkUnit } from '../../../database/models/MasterWorkUnit';
import { I_ResponsePagination } from '../../../interfaces/pagination.interface';
import { setPagination } from '../../../lib/utils/pagination.util';

class UserRepository implements I_UserRepository {
    private repository = AppDataSource.getRepository(MasterWorkUnit);

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

            const result = await this.repository.findOne({
                where: {
                    deleted_at: IsNull(),
                    unit_id: id
                },
            });

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'user' }),
                    record: result
                }
            }

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
                    unit_id: result.unit_id
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
                    unit_id: id
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
                    unit_id: result?.unit_id,
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
                    unit_id: id,
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
                    unit_id: id
                }
            }
        } catch (error: any) {
            return this.setupErrorMessage(error)
        }
    }



}

export default UserRepository;
