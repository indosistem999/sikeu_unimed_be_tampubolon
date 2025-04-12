import { IsNull, Like } from "typeorm";
import AppDataSource from "../../../config/dbconfig";
import { I_ResultService } from "../../../interfaces/app.interface";
import { MessageDialog } from "../../../lang";
import { I_ResponsePagination } from "../../../interfaces/pagination.interface";
import { setPagination } from "../../../lib/utils/pagination.util";
import { I_MasterOfficerRepository } from "../../../interfaces/masterOfficer.interface";
import { MasterOfficers } from "../../../database/models/MasterOfficers";



export class MasterOfficerRepository implements I_MasterOfficerRepository {
  private repository = AppDataSource.getRepository(MasterOfficers);

  setupErrorMessage(error: any): I_ResultService {
    return {
      success: false,
      message: error.message,
      record: error
    }
  }
}