import { getConnection, IsNull } from 'typeorm';
import { Roles } from '../../../database/models/Roles';
import { I_RequestCustom, I_ResultService } from '../../../interfaces/app.interface';
import { MessageDialog } from '../../../lang';
import AppDataSource from '../../../config/dbconfig';
import { MasterModule } from '../../../database/models/MasterModule';
import { RoleModuleAssociation } from '../../../database/models/RoleModuleAssociation';
import { I_FeatureAccessRepository } from '../../../interfaces/featureAccess.interface';
import { ModuleMenuAssociation } from '../../../database/models/ModuleMenuAssociation';
import { MasterMenu } from '../../../database/models/MasterMenu';
import { selectDetailMenu } from '../master_menu/constanta';
import { snapLogActivity } from '../../../events/publishers/logUser.publisher';
import { TypeLogActivity } from '../../../lib/utils/global.util';

class FeatureAccessRepository implements I_FeatureAccessRepository {
  private roleRepo = AppDataSource.getRepository(Roles);
  private menuRepo = AppDataSource.getRepository(MasterMenu)
  private moduleRepo = AppDataSource.getRepository(MasterModule);
  private assocRepo = AppDataSource.getRepository(RoleModuleAssociation)
  private featureRepo = AppDataSource.getRepository(ModuleMenuAssociation);

  setupErrorMessage(error: any): I_ResultService {
    return {
      success: false,
      message: error.message,
      record: error
    }
  }

  async bulkInsert(moduleId: string, menuId: string, items: Record<string, any>, opt: Record<string, any>): Promise<Record<string, any>> {
    const { created_at, created_by } = opt
    const payload: Record<string, any>[] = items.map((p: any) => {
      const data = {
        ...p,
        module_access_id: moduleId,
        menu_id: menuId,
        created_at,
        created_by,
        updated_at: created_at,
        updated_by: created_by
      }

      return data;
    });

    try {
      const result = await this.featureRepo.insert(payload);
      return {
        success: true,
        record: {
          module_access_id: moduleId,
          menu_id: menuId,
          row_insert: result?.identifiers,
          total_row: result?.raw?.affectedRows ?? 0
        }
      }
    } catch (error: any) {
      return {
        success: false,
        record: error
      }
    }


  }

  async bulkUpdate(listFeatures: Record<string, any>[], listAccess: Record<string, any>[], opt: Record<string, any>): Promise<Record<string, any>> {
    const {
      module_access_id,
      menu_id,
      created_at,
      created_by
    } = opt

    const successCapture: Record<string, any>[] = []
    const errorCapture: Record<string, any>[] = []


    for (let i = 0; i < listAccess.length; i++) {
      const fT = listAccess[i];

      const findAccess = listFeatures.find((p: any) => p?.access_name?.toLowerCase() == fT?.access_name?.toLowerCase())

      if (findAccess) {
        // Update
        const resultUpdate = await this.featureRepo.save({ ...findAccess, ...fT, updated_at: created_at, updated_by: created_by })

        if (resultUpdate) {
          successCapture.push({ success: true, record: resultUpdate })
        }
        else {
          errorCapture.push({ success: false, record: resultUpdate })
        }
      }
      else {
        // Insert
        const resultInsert = await this.featureRepo.save(this.featureRepo.create({
          module_access_id,
          menu_id,
          ...fT
        }))

        if (resultInsert) {
          successCapture.push({ success: true, record: resultInsert })
        }
        else {
          errorCapture.push({ success: false, record: resultInsert })
        }
      }

    }


    return {
      successCapture,
      errorCapture
    }
  }

  async fetch(filters: Record<string, any>): Promise<I_ResultService> {
    try {
      // Check Role
      const role = await this.roleRepo.findOne({
        where: {
          deleted_at: IsNull(),
          role_id: filters?.role_id
        },
        select: { role_id: true, role_name: true, role_slug: true }
      });

      if (!role) {
        return {
          success: false,
          message: MessageDialog.__('error.default.notFoundItem', { item: `Role ` }),
          record: role
        }
      }

      // Check Module
      const module = await this.moduleRepo.findOne({
        where: { deleted_at: IsNull(), module_id: filters?.module_id },
        select: {
          module_id: true,
          module_name: true,
          module_path: true
        }
      })

      if (!module) {
        return {
          success: false,
          message: MessageDialog.__('error.default.notFoundItem', { item: `Module` }),
          record: module
        }
      }

      const roleModuleRow = await this.assocRepo.findOne({
        where: {
          deleted_at: IsNull(),
          master_module: {
            module_id: filters?.module_id,
          },
          role: {
            role_id: filters?.role_id
          }
        },
        select: {
          module_access_id: true,
        }
      })


      if (!roleModuleRow) {
        return {
          success: false,
          message: MessageDialog.__('error.default.notFoundItem', { item: `Role module association` }),
          record: module
        }
      }


      const rows = await this.menuRepo.find({
        where: {
          deleted_at: IsNull(),
          parent: IsNull(),
          master_module: {
            module_id: filters?.module_id
          }
        },
        relations: [
          'parent',
          'children',
          'master_module',
          'children.children',
          'access_menu',
          'children.children.children',
        ],
        select: selectDetailMenu
      })


      return {
        success: true,
        message: 'Get feature access successfully',
        record: {
          role: {
            role_id: role.role_id,
            role_name: role.role_name,
            role_slug: role.role_slug
          },
          module: {
            module_id: module.module_id,
            module_name: module.module_name,
            module_path: module.module_path
          },
          role_module_association: {
            module_access_id: roleModuleRow?.module_access_id
          },
          list_menu: rows
        }
      }

    } catch (error: any) {
      return this.setupErrorMessage(error)
    }
  }

  /** Store Data */
  async store(req: I_RequestCustom, roleId: string, payload: Record<string, any>): Promise<I_ResultService> {
    try {
      const { created_at, created_by, features } = payload
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

      if (features?.length <= 0) {
        return {
          success: false,
          message: MessageDialog.__('error.failed.featureList'),
          record: {
            total_features: features?.length
          }
        }
      }

      let errorCapture: Record<string, any>[] = []
      let successCapture: Record<string, any>[] = []

      for (let i = 0; i < features.length; i++) {
        const assocModule = features[i];

        if (!assocModule?.module_access_id) {
          continue
        }

        const findAssoc = await this.assocRepo.findOne({
          where: {
            deleted_at: IsNull(),
            module_access_id: assocModule.module_access_id
          },
          select: {
            module_access_id: true,
            role: { role_id: true },
            master_module: { module_id: true }
          }
        })

        if (!findAssoc) {
          continue;
        }

        if (assocModule?.list_menu?.length <= 0) {
          continue
        }

        // Operate module menu access
        for (let a = 0; a < assocModule.list_menu.length; a++) {
          const itemMenu = assocModule.list_menu[a];

          if (itemMenu?.list_access?.length <= 0) {
            continue
          }

          // Find into ModuleMenuAssoc
          const listFeatures = await this.featureRepo.find({
            where: {
              deleted_at: IsNull(),
              module_access_id: assocModule.module_access_id,
              menu_id: itemMenu?.menu_id
            }
          })

          if (listFeatures?.length > 0) {
            // Update Row
            const result = await this.bulkUpdate(
              listFeatures,
              itemMenu.list_access,
              {
                created_at,
                created_by,
                menu_id: itemMenu.menu_id,
                module_access_id: assocModule.module_access_id,
              }
            )

            successCapture = [...successCapture, ...result.successCapture]
            errorCapture = [...errorCapture, ...result.errorCapture]
          }
          else {
            const result = await this.bulkInsert(
              assocModule.module_access_id,
              itemMenu.menu_id,
              itemMenu.list_access,
              { created_at, created_by }
            )

            if (!result?.success) {
              errorCapture.push(result)
            } else {
              successCapture.push(result)
            }
          }
        }

      }

      const userId: any = req?.user?.user_id
      await snapLogActivity(
        req,
        userId,
        TypeLogActivity.FeatureAccess.Label,
        TypeLogActivity.FeatureAccess.API.Create,
        payload.created_at,
        null,
        { operation: successCapture }
      )

      const msg: string = errorCapture?.length > 0 ? MessageDialog.__('error.failed.assignMenuAccess') : MessageDialog.__('success.accessMenu.assigned')

      return {
        success: true,
        message: msg,
        record: {
          success_insert: successCapture,
          error_insert: errorCapture
        }
      }


    }
    catch (error: any) {
      return this.setupErrorMessage(error)
    }
  }



}

export default FeatureAccessRepository;
