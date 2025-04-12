
import { I_ResultService } from "../../../interfaces/app.interface";
import { I_MasterModuleRepository } from "../../../interfaces/masterModule.interface";
import AppDataSource from "../../../config/dbconfig";
import { MasterModule } from "../../../database/models/MasterModule";
import { MessageDialog } from "../../../lang";
import { propSchema } from "./constanta";
import { IsNull } from "typeorm";
import { makeFullUrlFile, removeFileInStorage } from "../../../config/storages";


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
                    module_path: masterModule?.module_path,
                    order_number: masterModule?.order_number,
                    icon: makeFullUrlFile(masterModule?.icon)
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

            const queryBuilder = this.moduleRepo.createQueryBuilder(`${propSchema.alias}`)
                .select([
                    `${propSchema.alias}.module_id as module_id`,
                    `${propSchema.alias}.module_name as module_name`,
                    `${propSchema.alias}.module_path as module_path`,
                    `${propSchema.alias}.order_number as order_number`,
                    `CASE
                            WHEN ${propSchema.alias}.icon IS NULL
                            THEN NULL
                            WHEN ${propSchema.alias}.icon = ''
                            THEN NULL
                            ELSE CONCAT('${payload?.base_url}', '/', ${propSchema.alias}.icon)
                        END
                    as icon`,
                    `${propSchema.alias}.created_at as created_at`,
                    `${propSchema.alias}.created_by as created_by`,
                    `${propSchema.alias}.updated_at as updated_at`,
                    `${propSchema.alias}.updated_by as updated_by`,
                ])
                .where(`${propSchema.alias}.deleted_at is null`);

            if (payload?.search !== null) {
                const { search } = payload;
                queryBuilder.andWhere(
                    `(${propSchema.alias}.module_name LIKE :search OR ${propSchema.alias}.module_path LIKE :search)`,
                    { search: `%${search}%` }
                );
            }

            if (payload?.sorting && payload?.sorting?.length > 0) {
                payload?.sorting.forEach((sort: any) => {
                    queryBuilder.addOrderBy(`${propSchema.alias}.${sort.column}`, sort.order);
                });
            }

            const rows = await queryBuilder.getRawMany()

            return {
                success: true,
                message: MessageDialog.__('success.masterModule.fetchAll'),
                record: {
                    rows,
                    total_row: rows.length
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
                    'module_path',
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
                    ...row,
                    icon: makeFullUrlFile(row?.icon),
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

    /** Update */
    async update(id: string, payload: Record<string, any>): Promise<I_ResultService> {
        try {
            let masterModule = await this.moduleRepo.findOne({
                where: {
                    module_id: id,
                    deleted_at: IsNull(),
                },
            })

            if (!masterModule) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'Module' }),
                    record: masterModule
                }
            }

            const fileName: string = masterModule?.icon

            masterModule = {
                ...masterModule,
                ...payload
            }

            await this.moduleRepo.save(masterModule);

            // Delete old file
            if (fileName !== null && fileName !== '') {
                const removeFile = removeFileInStorage(fileName)

                if (!removeFile.success) {
                    return {
                        success: true,
                        message: `${MessageDialog.__('success.masterModule.update')}. But ${removeFile.message}.`,
                        record: {
                            module_id: masterModule?.module_id,
                            module_name: masterModule?.module_name,
                            module_path: masterModule?.module_path,
                            order_number: masterModule?.order_number,
                            icon: makeFullUrlFile(masterModule?.icon)
                        }
                    }
                }
            }


            return {
                success: true,
                message: MessageDialog.__('success.masterModule.update'),
                record: {
                    module_id: masterModule?.module_id,
                    module_name: masterModule?.module_name,
                    module_path: masterModule?.module_path,
                    order_number: masterModule?.order_number,
                    icon: makeFullUrlFile(masterModule?.icon)
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
}

export default MasterModuleRepository