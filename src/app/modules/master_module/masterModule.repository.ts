import { Request } from "express";
import { I_RequestCustom, I_ResultService } from "../../../interfaces/app.interface";
import { I_MasterModuleRepository } from "../../../interfaces/masterModule.interface";
import AppDataSource from "../../../config/dbconfig";
import { MasterModule } from "../../../database/models/MasterModule";
import { MessageDialog } from "../../../lang";
import { propSchema } from "./masterModule.constanta";
import { IsNull } from "typeorm";


class MasterModuleRepository implements I_MasterModuleRepository {
    private moduleRepo = AppDataSource.getRepository(MasterModule)

    async store(payload: Record<string, any>): Promise<I_ResultService> {
        try {
            const masterModule = await this.moduleRepo.save(this.moduleRepo.create(payload))

            if (!masterModule) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'Master module' }),
                    record: masterModule
                }
            }

            return {
                success: true,
                message: MessageDialog.__('success.masterModule.create'),
                record: {
                    module_id: masterModule?.module_id,
                    module_name: masterModule?.module_name,
                    folder_name: masterModule?.folder_name,
                    order_number: masterModule?.order_number
                },
            };
        } catch (err: any) {
            return {
                success: false,
                message: err.message,
                record: err,
            };
        }
    }

    /** Fetch All Modules */
    async fetchAll(payload: Record<string, any>): Promise<I_ResultService> {
        try {

            const queryBuilder = this.moduleRepo.createQueryBuilder(propSchema.tableName)
                .where('master_module.deleted_at is null');

            if (payload?.search !== null) {
                const { search } = payload;
                queryBuilder.andWhere(
                    '(master_module.module_name LIKE :search OR master_module.folder_name LIKE :search)',
                    { search: `%${search}%` }
                );
            }

            if (payload?.sorting && payload?.sorting?.length > 0) {
                payload?.sorting.forEach((sort: any) => {
                    queryBuilder.addOrderBy(`master_module.${sort.column}`, sort.order);
                });
            }

            const [rows, count] = await queryBuilder.getManyAndCount()

            return {
                success: true,
                message: MessageDialog.__('success.masterModule.fetchAll'),
                record: {
                    rows,
                    total_row: count
                }
            }
        } catch (err: any) {
            return {
                success: false,
                message: err.message,
                record: err
            }
        }
    }

    /** Fetch By Modules ID */
    async fetchById(id: string): Promise<I_ResultService> {
        try {
            const row = await this.moduleRepo.findOne({
                where: {
                    module_id: id,
                    deleted_at: IsNull()
                },
                select: [
                    'module_id',
                    'module_name',
                    'folder_name',
                    'logo',
                    'icon',
                    'order_number'
                ]
            })

            if (!row) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: `Module` }),
                    record: row
                }
            }

            return {
                success: true,
                message: MessageDialog.__('success.masterModule.findOne'),
                record: {

                }
            }
        } catch (error: any) {
            return {
                success: false,
                message: error.message,
                record: error
            }
        }
    }

    /** Delete By Id */
    async softDelete(id: string, payload: Record<string, any>): Promise<I_ResultService> {
        try {
            let masterModule = await this.moduleRepo.findOne({
                where: {
                    module_id: id,
                    deleted_at: IsNull()
                }
            });

            if (!masterModule) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'Module' }),
                    record: masterModule
                }
            }

            masterModule = {
                ...masterModule,
                ...payload
            };

            await this.moduleRepo.save(masterModule);

            return {
                success: true,
                message: MessageDialog.__('success.masterModule.softDelete'),
                record: {
                    module_id: id
                }
            }

        } catch (err: any) {
            return {
                success: false,
                message: err.message,
                record: err
            }
        }
    }
}

export default MasterModuleRepository