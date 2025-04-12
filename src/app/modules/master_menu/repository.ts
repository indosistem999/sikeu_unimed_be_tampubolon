import AppDataSource from '../../../config/dbconfig';
import { Request } from 'express';
import { I_ResultService } from '../../../interfaces/app.interface';
import { FindOptionsWhere, IsNull } from 'typeorm';
import { MessageDialog } from '../../../lang';
import { makeFullUrlFile, removeFileInStorage } from '../../../config/storages';
import { I_MasterMenuRepository } from '../../../interfaces/masterMenu.interface';
import { MasterMenu } from '../../../database/models/MasterMenu';
import { selectDetailMenu, selectOnlyChildMenu } from './constanta';

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
        where: whereCondition,
        relations: [
          'parent',
          'children',
          'master_module'
        ],
        select: {
          menu_id: true,
          name: true,
          slug: true,
          parent: {
            menu_id: true,
            name: true,
            slug: true,
            created_at: true,
            created_by: true
          },
          children: {
            menu_id: true,
            name: true,
            slug: true,
            children: {
              menu_id: true,
              name: true,
              slug: true,
              children: {
                menu_id: true,
                name: true,
                slug: true,
                master_module: {
                  module_id: true,
                  module_name: true,
                  module_path: true
                },
                created_at: true,
                updated_at: true
              }
            },
            master_module: {
              module_id: true,
              module_name: true,
              module_path: true
            },
            created_at: true,
            updated_at: true
          },
          master_module: {
            module_id: true,
            module_name: true,
            module_path: true
          },
          created_at: true,
          updated_at: true
        }
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
  async store(payload: Record<string, any>): Promise<I_ResultService> {
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
  async update(id: string, payload: Record<string, any>): Promise<I_ResultService> {
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

      result = { ...result, ...payload }

      await this.repository.save(result);


      if (fileName !== null && fileName !== '') {
        const removeFile = removeFileInStorage(fileName)

        if (!removeFile.success) {
          return {
            success: true,
            message: `${MessageDialog.__('success.masterMenu.update')}. But ${removeFile.message}.`,
            record: {
              menu_id: result?.menu_id,
            }
          }
        }
      }

      return {
        success: true,
        message: MessageDialog.__('success.masterMenu.update'),
        record: {
          menu_id: result?.menu_id,
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


      if (result?.children && result?.children?.length > 0) {
        result.children.forEach(child => {
          child.deleted_at = payload.deleted_at;
          child.deleted_by = payload.deleted_by;
        });
      }

      result = {
        ...result,
        ...payload
      }

      await this.repository.save(result);
      await this.repository.save(result.children);

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
