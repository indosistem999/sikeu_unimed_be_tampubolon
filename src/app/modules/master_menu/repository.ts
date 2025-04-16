import AppDataSource from '../../../config/dbconfig';
import { Request } from 'express';
import { I_RequestCustom, I_ResultService } from '../../../interfaces/app.interface';
import { FindOptionsWhere, IsNull } from 'typeorm';
import { MessageDialog } from '../../../lang';
import { makeFullUrlFile, removeFileInStorage } from '../../../config/storages';
import { I_MasterMenuRepository } from '../../../interfaces/masterMenu.interface';
import { MasterMenu } from '../../../database/models/MasterMenu';
import { selectDetailMenu, selectOnlyChildMenu } from './constanta';
import { snapLogActivity } from '../../../events/publishers/logUser.publisher';
import { TypeLogActivity } from '../../../lib/utils/global.util';

class MasterMenuRepository implements I_MasterMenuRepository {
  private repository = AppDataSource.getRepository(MasterMenu);

  private setupErrorMessage(error: any): I_ResultService {
    // Handle TypeORM specific errors
    if (error.code === 'ECONNREFUSED') {
      return {
        success: false,
        message: 'Database connection error',
        record: null
      }
    }

    // Handle constraint violations
    if (error.code === '23505') { // Unique violation
      return {
        success: false,
        message: 'Duplicate entry found',
        record: null
      }
    }

    // Handle foreign key violations
    if (error.code === '23503') {
      return {
        success: false,
        message: 'Referenced record not found',
        record: null
      }
    }

    // Default error handling
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      record: error
    }
  }

  /** Fetch Data */
  async fetch(filters: Record<string, any>): Promise<I_ResultService> {
    try {
      let whereCondition: FindOptionsWhere<MasterMenu> = {
        deleted_at: IsNull()
      }

      if (filters?.module_id != null && filters?.module_id != '') {
        const moduleId: string = filters?.module_id
        whereCondition = { ...whereCondition, master_module: { module_id: moduleId } }
      }

      let result = await this.repository.find({
        where: {
          ...whereCondition,
          parent: IsNull()
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

      if (!result) {
        return {
          success: false,
          message: MessageDialog.__('error.default.emptyData', { item: 'Master Menu' }),
          record: result
        }
      }


      return {
        success: true,
        message: MessageDialog.__('success.masterMenu.fetch'),
        record: result
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
          menu_id: id
        },
        relations: [
          'parent',
          'children',
          'master_module'
        ],
        select: selectDetailMenu
      });

      if (!result) {
        return {
          success: false,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'Master Menu' }),
          record: result
        }
      }

      result.icon = makeFullUrlFile(result?.icon)

      return {
        success: true,
        message: MessageDialog.__('success.masterMenu.fetch'),
        record: result
      }
    } catch (error: any) {
      return this.setupErrorMessage(error);
    }
  }

  /** Store Data */
  async store(req: I_RequestCustom, payload: Record<string, any>): Promise<I_ResultService> {
    try {
      const { type_store, ...rest } = payload

      const result = await this.repository.save(this.repository.create(rest));

      if (!result) {
        return {
          success: false,
          message: MessageDialog.__('error.storeMenu.store'),
          record: result
        }
      }

      let optMsg: string = MessageDialog.__('success.masterMenu.storeMenu')

      if (type_store == 'child') {
        optMsg = MessageDialog.__('success.masterMenu.storeSubMenu')
      }


      const userId: any = req?.user?.user_id
      await snapLogActivity(
        req,
        userId,
        type_store == 'child' ? TypeLogActivity.SubMenu.Label : TypeLogActivity.Menu.Label,
        type_store == 'child' ? TypeLogActivity.SubMenu.API.Create : TypeLogActivity.Menu.API.Create,
        payload.created_at,
        null,
        result
      )

      return {
        success: true,
        message: optMsg,
        record: {
          menu_id: result.menu_id
        }
      }
    } catch (error: any) {
      return this.setupErrorMessage(error)
    }
  }


  /** Update Data By Id */
  async update(req: I_RequestCustom, id: string, payload: Record<string, any>): Promise<I_ResultService> {
    try {
      let result = await this.repository.findOne({
        where: {
          deleted_at: IsNull(),
          menu_id: id
        }
      });

      if (!result) {
        return {
          success: false,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'Master Menu' }),
          record: result
        }
      }

      const fileName: string = result?.icon

      const updateResult = { ...result, ...payload }

      await this.repository.save(updateResult);


      /** Create Log Activity User */
      const userId: any = req?.user?.user_id
      await snapLogActivity(
        req,
        userId,
        TypeLogActivity.Menu.Label,
        TypeLogActivity.Menu.API.Update,
        payload.updated_at,
        result,
        updateResult
      )


      if (fileName !== null && fileName !== '') {
        const removeFile = removeFileInStorage(fileName)

        if (!removeFile.success) {
          return {
            success: true,
            message: `${MessageDialog.__('success.masterMenu.update')}. But ${removeFile.message}.`,
            record: {
              menu_id: updateResult?.menu_id,
            }
          }
        }
      }

      return {
        success: true,
        message: MessageDialog.__('success.masterMenu.update'),
        record: {
          menu_id: updateResult?.menu_id,
        }
      }

    } catch (error: any) {
      return this.setupErrorMessage(error)
    }
  }

  /** Soft Delete Data By Id */
  async softDelete(req: I_RequestCustom, id: string, payload: Record<string, any>): Promise<I_ResultService> {
    try {

      const snapcut: {
        before: Record<string, any> | null,
        after: Record<string, any> | null
      } = { before: null, after: null }

      let result = await this.repository.findOne({
        where: {
          menu_id: id,
          deleted_at: IsNull()
        },
        relations: [
          'children',
        ],
      })

      if (!result) {
        return {
          success: false,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'Master Menu' }),
          record: result
        }
      }

      snapcut.before = result;


      if (result?.children && result?.children?.length > 0) {
        result.children.forEach(child => {
          child.deleted_at = payload.deleted_at;
          child.deleted_by = payload.deleted_by;
        });
      }

      const updateResult = {
        ...result,
        ...payload
      }

      await this.repository.save(updateResult);
      await this.repository.save(updateResult.children);

      snapcut.after = updateResult;

      const userId: any = req?.user?.user_id
      await snapLogActivity(
        req,
        userId,
        TypeLogActivity.Menu.Label,
        TypeLogActivity.Menu.API.Delete,
        payload.deleted_at,
        snapcut.before,
        snapcut.after
      )

      return {
        success: true,
        message: MessageDialog.__('success.masterMenu.softDelete'),
        record: {
          menu_id: id
        }
      }
    } catch (error: any) {
      return this.setupErrorMessage(error)
    }
  }



}

export default MasterMenuRepository;
