import AppDataSource from '../../../config/dbconfig';
import { I_ResultService } from '../../../interfaces/app.interface';
import { IsNull } from 'typeorm';
import { MessageDialog } from '../../../lang';
import { I_WorkUnitRepository } from '../../../interfaces/workUnit.interface';
import { MasterWorkUnit } from '../../../database/models/MasterWorkUnit';

class WorkUnitRepository implements I_WorkUnitRepository {
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
      let result = await this.repository.find({
        where: {
          deleted_at: IsNull(),
        },
      })

      if (!result) {
        return {
          success: false,
          message: MessageDialog.__('error.default.emptyData', { item: 'work unit' }),
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
          unit_id: id
        },
      });

      if (!result) {
        return {
          success: false,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'work unit' }),
          record: result
        }
      }

      return {
        success: true,
        message: MessageDialog.__('success.workUnit.fetch'),
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
          message: MessageDialog.__('error.failed.storeWorkUnit'),
          record: result
        }
      }

      return {
        success: true,
        message: MessageDialog.__('success.workUnit.store'),
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
          message: MessageDialog.__('error.default.notFoundItem', { item: 'Work unit' }),
          record: result
        }
      }

      result = { ...result, ...payload }

      await this.repository.save(result);


      return {
        success: true,
        message: MessageDialog.__('success.workUnit.update'),
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
          message: MessageDialog.__('error.default.notFoundItem', { item: 'work unit' }),
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
        message: MessageDialog.__('success.workUnit.softDelete'),
        record: {
          unit_id: id
        }
      }
    } catch (error: any) {
      return this.setupErrorMessage(error)
    }
  }



}

export default WorkUnitRepository;
