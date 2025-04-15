import { IsNull, Like } from "typeorm";
import AppDataSource from "../../../config/dbconfig";
import { I_ResultService } from "../../../interfaces/app.interface";
import { MessageDialog } from "../../../lang";
import { I_ResponsePagination } from "../../../interfaces/pagination.interface";
import { setPagination } from "../../../lib/utils/pagination.util";
import { I_MasterOfficerRepository } from "../../../interfaces/masterOfficer.interface";
import { MasterOfficers } from "../../../database/models/MasterOfficers";
import { selectOfficer } from "./constanta";



export class MasterOfficerRepository implements I_MasterOfficerRepository {
  private repository = AppDataSource.getRepository(MasterOfficers);

  setupErrorMessage(error: any): I_ResultService {
    return {
      success: false,
      message: error.message,
      record: error
    }
  }

  async fetch(filters: Record<string, any>): Promise<I_ResultService> {
    try {
      const { paging, sorting } = filters
      let whereConditions: Record<string, any>[] = []


      if (paging?.search && paging?.search != '' && paging?.search != null) {
        const searchTerm: string = paging?.search
        whereConditions = [
          { nip: Like(`%${searchTerm}%`), deleted_at: IsNull() },
          { full_name: Like(`%${searchTerm}%`), deleted_at: IsNull() },
          { posititon_name: Like(`%${searchTerm}%`), deleted_at: IsNull() },
          { position_type: Like(`%${searchTerm}%`), deleted_at: IsNull() },
          { start_date_position: [{ name: Like(`%${searchTerm}%`) }], deleted_at: IsNull() },
          {
            work_unit: [
              {
                unit_name: Like(`%${searchTerm}%`)
              }
            ],
            deleted_at: IsNull()
          }
        ];
      }

      let [rows, count] = await this.repository.findAndCount({
        select: selectOfficer,
        where: whereConditions,
        relations: {
          job_category: true,
          work_unit: {
            pegawai: false
          }
        },
        skip: paging?.skip,
        take: paging?.limit,
        order: sorting
      })

      const pagination: I_ResponsePagination = setPagination(rows, count, paging.page, paging.limit);


      return {
        success: true,
        message: MessageDialog.__('success.sppdJenisBiaya.fetch'),
        record: pagination
      }
    } catch (error: any) {
      return this.setupErrorMessage(error)
    }
  }


  async fetchById(id: string): Promise<I_ResultService> {
    try {
      const result = await this.repository.findOne({
        where: {
          deleted_at: IsNull(),
          officers_id: id
        },
        select: selectOfficer,
      });

      if (!result) {
        return {
          success: false,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'Officer' }),
          record: result
        }
      }

      return {
        success: true,
        message: MessageDialog.__('success.masterOfficer.fetch'),
        record: result
      }
    } catch (error: any) {
      return this.setupErrorMessage(error);
    }
  }

  async store(payload: Record<string, any>): Promise<I_ResultService> {
    try {
      const result = await this.repository.save(this.repository.create(payload));

      if (!result) {
        return {
          success: false,
          message: MessageDialog.__('error.failed.storeOfficer'),
          record: result
        }
      }

      return {
        success: false,
        message: MessageDialog.__('success.masterOfficer.store'),
        record: result
      }
    } catch (err: any) {
      return this.setupErrorMessage(err)
    }
  }

  async update(id: string, payload: Record<string, any>): Promise<I_ResultService> {
    try {
      let result = await this.repository.findOne({
        where: {
          deleted_at: IsNull(),
          officers_id: id
        }
      });

      if (!result) {
        return {
          success: false,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'Officer' }),
          record: result
        }
      }

      result = { ...result, ...payload }

      await this.repository.save(result);


      return {
        success: true,
        message: MessageDialog.__('success.masterOfficer.update'),
        record: {
          officers_id: result?.officers_id,
        }
      }

    } catch (error: any) {
      return this.setupErrorMessage(error)
    }
  }

  async softDelete(id: string, payload: Record<string, any>): Promise<I_ResultService> {
    try {
      let result = await this.repository.findOne({
        where: {
          officers_id: id,
          deleted_at: IsNull()
        }
      })

      if (!result) {
        return {
          success: false,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'Officer' }),
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
        message: MessageDialog.__('success.masterOfficer.softDelete'),
        record: {
          officers_id: id
        }
      }
    } catch (error: any) {
      return this.setupErrorMessage(error)
    }
  }




}