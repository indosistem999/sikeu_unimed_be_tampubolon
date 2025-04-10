import { I_RequestCustom } from "../../../interfaces/app.interface";
import { Response, NextFunction } from 'express'
import { sendErrorResponse } from "../../../lib/utils/response.util";
import { MessageDialog } from "../../../lang";
import { allSchema as sc } from '../../../constanta'
import AppDataSource from "../../../config/dbconfig";
import { IsNull } from "typeorm";
import { Roles } from "../../../database/models/Roles";
import { MasterModule } from "../../../database/models/MasterModule";

class RoleAssignModuleValidation {
    async roleIdValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        if (!req?.params?.[sc.role.primaryKey]) {
            sendErrorResponse(
                res,
                422,
                MessageDialog.__('error.missing.requiredEntry', { label: 'Role id' }),
                null
            );
        }

        const roleId: string = req?.params?.[sc.role.primaryKey]
        const rowRole = await AppDataSource.getRepository(Roles).findOne({
            where: { deleted_at: IsNull(), role_id: roleId }
        })

        if (!rowRole) {
            sendErrorResponse(res, 404, MessageDialog.__('error.default.notFoundItem', { item: `Role ${roleId}` }), rowRole)
        }

        next()
    }

    async moduleIdValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        if (!req?.params?.[sc.module.primaryKey]) {
            sendErrorResponse(
                res,
                422,
                MessageDialog.__('error.missing.requiredEntry', { label: 'Module id' }),
                null
            );
        }
        const moduleId: string = req?.params?.[sc.module.primaryKey]
        const rowModule = await AppDataSource.getRepository(MasterModule).findOne({
            where: { deleted_at: IsNull(), module_id: moduleId }
        })

        if (!rowModule) {
            sendErrorResponse(res, 404, MessageDialog.__('error.default.notFoundItem', { item: `Module ${moduleId}` }), rowModule)
        }

        next()
    }
}

export default new RoleAssignModuleValidation();