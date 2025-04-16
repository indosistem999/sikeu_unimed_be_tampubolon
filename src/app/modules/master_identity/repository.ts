import AppDataSource from '../../../config/dbconfig';
import { I_MasterIdentityRepository } from '../../../interfaces/masterIdentity.interface';
import { MasterIdentity } from '../../../database/models/MasterIdentiry';
import { Request } from 'express';
import { I_RequestCustom, I_ResultService } from '../../../interfaces/app.interface';
import { IsNull } from 'typeorm';
import { MessageDialog } from '../../../lang';
import { makeFullUrlFile, removeFileInStorage } from '../../../config/storages';
import { MasterModule } from '../../../database/models/MasterModule';
import { TypeLogActivity } from '../../../lib/utils/global.util';
import { snapLogActivity } from '../../../events/publishers/logUser.publisher';

class MasterIdentityRepository implements I_MasterIdentityRepository {
  private repository = AppDataSource.getRepository(MasterIdentity);

  setupErrorMessage(error: any): I_ResultService {
    return {
      success: false,
      message: error.message,
      record: error
    }
  }

  /** Fetch Data */
  async fetch(req: Request): Promise<I_ResultService> {
    try {
      let result = await this.repository.findOne({
        where: {
          deleted_at: IsNull(),
        }
      })

      if (!result) {
        return {
          success: false,
          message: MessageDialog.__('error.default.emptyData', { item: 'Master Identity' }),
          record: result
        }
      }

      result.logo = makeFullUrlFile(result?.logo)

      return {
        success: true,
        message: MessageDialog.__('success.masterIdentity.fetch'),
        record: result
      }
    } catch (error: any) {
      return this.setupErrorMessage(error)
    }
  }

  /** Fetch By Id */
  async fetchById(id: string): Promise<I_ResultService> {
    try {
      let result = await this.repository.findOne({
        where: {
          identity_id: id,
          deleted_at: IsNull(),
        }
      })

      if (!result) {
        return {
          success: false,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'Master Identity' }),
          record: result
        }
      }

      result.logo = makeFullUrlFile(result?.logo)

      return {
        success: true,
        message: MessageDialog.__('success.masterIdentity.fetch'),
        record: result
      }
    } catch (error: any) {
      return this.setupErrorMessage(error)
    }
  }

  /** Store Data */
  async store(req: I_RequestCustom, payload: Record<string, any>): Promise<I_ResultService> {
    try {
      const { created_at, created_by, ...rest } = payload
      let operationType: string = 'create'
      let result: MasterIdentity | any
      const userId: any = req?.user?.user_id

      let snapcut: {
        before: Record<string, any> | null,
        after: Record<string, any> | null
      } = {
        before: null,
        after: null
      }

      const identity = await this.repository.findOne({
        where: {
          deleted_at: IsNull(),
        }
      })

      if (!identity) {
        // Create new 
        result = await this.repository.save(this.repository.create({
          ...rest,
          created_at,
          created_by,
          updated_at: created_at,
          updated_by: created_by
        }))

        snapcut.after = result;
      }
      else {
        snapcut.before = result

        // Update
        result = { ...identity, ...rest }
        result = await this.repository.save(result)
        snapcut.after = result
        operationType = 'update'
      }

      if (!result) {
        return {
          success: false,
          message: MessageDialog.__('error.failed.storeIdentity'),
          record: result
        }
      }

      await snapLogActivity(
        req,
        userId,
        TypeLogActivity.Identity.Label,
        operationType == 'create' ? TypeLogActivity.Identity.API.Create : TypeLogActivity.Identity.API.Update,
        created_at,
        snapcut.before,
        snapcut.after
      )

      return {
        success: true,
        message: MessageDialog.__('success.masterIdentity.store'),
        record: {
          identity_id: result.identity_id
        }
      }

    } catch (error: any) {
      return this.setupErrorMessage(error)
    }
  }


  /** Update Data By Id */
  async update(req: I_RequestCustom, id: string, payload: Record<string, any>): Promise<I_ResultService> {
    try {
      const result = await this.repository.findOne({
        where: {
          identity_id: id,
          deleted_at: IsNull()
        }
      })
      const userId: any = req?.user?.user_id


      if (!result) {
        return {
          success: false,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'Master Identity' }),
          record: result
        }
      }

      const fileName: string = result?.logo

      const updateResult: Record<string, any> = {
        ...result,
        ...payload
      }

      await this.repository.save(updateResult);

      await snapLogActivity(
        req,
        userId,
        TypeLogActivity.Identity.Label,
        TypeLogActivity.Identity.API.Update,
        payload?.updated_at,
        result,
        updateResult
      )


      if (fileName !== null && fileName !== '') {
        const removeFile = removeFileInStorage(fileName)

        if (!removeFile.success) {
          return {
            success: true,
            message: `${MessageDialog.__('success.masterIdentity.update')}. But ${removeFile.message}.`,
            record: {
              identity_id: result?.identity_id,
            }
          }
        }
      }

      return {
        success: true,
        message: MessageDialog.__('success.masterIdentity.update'),
        record: {
          identity_id: result.identity_id
        }
      }

    } catch (error: any) {
      return this.setupErrorMessage(error)
    }
  }

  /** Soft Delete Data By Id */
  async softDelete(req: I_RequestCustom, id: string, payload: Record<string, any>): Promise<I_ResultService> {
    try {
      const userId: any = req?.user?.user_id
      const result = await this.repository.findOne({
        where: {
          identity_id: id,
          deleted_at: IsNull()
        }
      })

      if (!result) {
        return {
          success: false,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'Master Identity' }),
          record: result
        }
      }

      const updateResult = {
        ...result,
        ...payload
      }

      await this.repository.save(updateResult);

      await snapLogActivity(
        req,
        userId,
        TypeLogActivity.Identity.Label,
        TypeLogActivity.Identity.API.Delete,
        payload?.updated_at,
        result,
        updateResult
      )

      return {
        success: true,
        message: MessageDialog.__('success.masterIdentity.softDelete'),
        record: {
          identity_id: id
        }
      }
    } catch (error: any) {
      return this.setupErrorMessage(error)
    }
  }



}

export default MasterIdentityRepository;
