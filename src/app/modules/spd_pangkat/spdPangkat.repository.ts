import { IsNull } from "typeorm";
import AppDataSource from "../../../config/dbconfig";
import { SPDPangkat } from "../../../database/models/SPDPangkat";
import { I_ResultService } from "../../../interfaces/app.interface";
import { I_SPDPangkatRepository } from "../../../interfaces/spdPangkat.interface";


export class SPDPangkatRepository implements I_SPDPangkatRepository {
    private repository = AppDataSource.getRepository(SPDPangkat);

    setupErrorMessage(error: any): I_ResultService {
        return {
            success: false,
            message: error.message,
            record: error
        }
    }

    async fetch(filters: Record<string, any>): Promise<I_ResultService> {
        try {
            const result = await this.repository.find({
                where: { deleted_at: IsNull() }
            })

            return {
                success: true,
                message: '',
                record: result
            }
        } catch (error: any) {
            return this.setupErrorMessage(error)
        }
    }
}