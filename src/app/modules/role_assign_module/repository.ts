import { IsNull } from 'typeorm';
import { Roles } from '../../../database/models/Roles';
import { I_RequestCustom, I_ResultService } from '../../../interfaces/app.interface';


import { MessageDialog } from '../../../lang';
import AppDataSource from '../../../config/dbconfig';
import { I_RoleAssignModuleRepository } from '../../../interfaces/roleAssignModule.interface';
import { MasterModule } from '../../../database/models/MasterModule';
import { RoleModuleAssociation } from '../../../database/models/RoleModuleAssociation';
import { snapLogActivity } from '../../../events/publishers/logUser.publisher';
import { NotificationOption, NotificationType, TypeLogActivity } from '../../../lib/utils/global.util';
import { eventPublishNotification } from '../../../events/publishers/notification.publisher';

class RoleAssignModuleRepository implements I_RoleAssignModuleRepository {
  private roleRepo = AppDataSource.getRepository(Roles);
  private moduleRepo = AppDataSource.getRepository(MasterModule)
  private assocRepo = AppDataSource.getRepository(RoleModuleAssociation);

  setupErrorMessage(error: any): I_ResultService {
    return {
      success: false,
      message: error.message,
      record: error
    }
  }

  async fetch(payload: Record<string, any>): Promise<I_ResultService> {
    try {
      const results = await this.moduleRepo.createQueryBuilder('module')
        .leftJoinAndSelect(
          RoleModuleAssociation,
          'association',
          'association.module_id = module.module_id'
        )
        .select([
          "module.module_id as module_id",
          "module.module_name as module_name",
          `(
            CASE
              WHEN module.icon IS NULL
              THEN NULL
              WHEN module.icon = ''
              THEN NULL
              ELSE CONCAT('${payload?.base_url}', '/', module.icon)
            END
          ) AS icon`,
          "module.order_number as order_number",
          "association.role_id as role_id",
          "association.module_access_id as module_access_id",
          `(
            CASE 
              WHEN association.role_id = :role_id 
              THEN true 
              ELSE false 
            END
          ) AS assigned_status
          `
        ])
        .setParameter("role_id", payload?.role_id)
        .orderBy("module.order_number", "ASC")
        .getRawMany();

      return {
        success: true,
        message: MessageDialog.__('success.roleModule.showModule'),
        record: results
      }
    } catch (error: any) {
      return this.setupErrorMessage(error)
    }
  }

  /** Store Data */
  async store(req: I_RequestCustom, roleId: string, payload: Record<string, any>): Promise<I_ResultService> {
    try {
      const { module_id, ...rest } = payload
      const rowRole = await this.roleRepo.findOne({
        where: { deleted_at: IsNull(), role_id: roleId }
      })

      if (!rowRole) {
        return {
          success: false,
          message: MessageDialog.__('error.default.notFoundItem', { item: `Role ${payload?.role_id}` }),
          record: rowRole
        }
      }

      const rowModule = await this.moduleRepo.findOne({
        where: { deleted_at: IsNull(), module_id: module_id }
      })

      if (!rowModule) {
        return {
          success: false,
          message: MessageDialog.__('error.default.notFoundItem', { item: `Module ${payload?.module_id}` }),
          record: rowModule
        }
      }

      const findAssoc = await this.assocRepo.findOne({
        where: {
          deleted_at: IsNull(),
          master_module: {
            module_id: module_id
          },
          role: {
            role_id: roleId
          }
        },
        relations: [
          'role',
          'master_module'
        ],
        select: {
          module_access_id: true,
          role: {
            role_id: true,
            role_name: true,
          },
          master_module: {
            module_id: true,
            module_name: true
          }
        }
      })

      if (findAssoc) {
        return {
          success: false,
          message: MessageDialog.__('error.existed.roleModule'),
          record: findAssoc
        }
      }

      const result = await this.assocRepo.save(this.assocRepo.create({
        role: rowRole as Roles,
        master_module: rowModule as MasterModule,
        ...rest
      }))

      if (!result) {
        return {
          success: false,
          message: MessageDialog.__('error.failed.assignRoleModule'),
          record: result
        }
      }

      // Log Activity
      const userId: any = req?.user?.user_id
      await snapLogActivity(
        req,
        userId,
        TypeLogActivity.RoleModule.Label,
        TypeLogActivity.RoleModule.API.Create(
          rowModule.module_name,
          rowRole.role_name
        ),
        payload.created_at,
        null,
        result
      )

      // Notification
      await eventPublishNotification(
        req?.user,
        NotificationOption.RoleModule.Topic,
        NotificationOption.RoleModule.Event.Create(
          rowModule.module_name,
          rowRole.role_name
        ),
        NotificationType.Information,
        payload.created_at,
        result
      )

      return {
        success: true,
        message: MessageDialog.__('success.roleModule.assigned'),
        record: {
          module_access_id: result?.module_access_id,
          role_id: roleId,
          module_id: payload?.module_id,
          created_at: payload?.created_at
        }
      }

    }
    catch (error: any) {
      return this.setupErrorMessage(error)
    }
  }

  /** Delete Data */
  async delete(req: I_RequestCustom, roleId: string, moduleId: string, payload: Record<string, any>): Promise<I_ResultService> {
    try {
      const result = await this.assocRepo.findOne({
        where: {
          deleted_at: IsNull(),
          role: { role_id: roleId },
          master_module: { module_id: moduleId }
        },
        relations: {
          role: true,
          master_module: true
        }
      })

      if (!result) {
        return {
          success: false,
          message: MessageDialog.__('error.failed.unassignedRoleModule'),
          record: result
        }
      }

      const roleName: string = result?.role?.role_name;
      const moduleName: string = result?.master_module?.module_name
      const updateResult = {
        ...result,
        ...payload
      }

      await this.assocRepo.save(updateResult)


      // Log Activity
      const userId: any = req?.user?.user_id
      await snapLogActivity(
        req,
        userId,
        TypeLogActivity.RoleModule.Label,
        TypeLogActivity.RoleModule.API.Delete(
          roleName,
          moduleName
        ),
        payload.deleted_at,
        result,
        updateResult
      )

      // Notification
      await eventPublishNotification(
        req?.user,
        NotificationOption.RoleModule.Topic,
        NotificationOption.RoleModule.Event.Delete(
          roleName,
          moduleName
        ),
        NotificationType.Information,
        payload.deleted_at,
        updateResult
      )


      return {
        success: true,
        message: MessageDialog.__('success.roleModule.softDelete'),
        record: {
          role_id: roleId,
          module_id: moduleId
        }
      }

    } catch (error: any) {
      return this.setupErrorMessage(error)
    }
  }


}

export default RoleAssignModuleRepository;
