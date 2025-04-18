import { IsNull, Like } from "typeorm";
import AppDataSource from "../../../config/dbconfig";
import { MasterWorkUnit } from "../../../database/models/MasterWorkUnit";
import { SPPDPangkat } from "../../../database/models/SPPDPangkat";

export const findAndCreateWorkUnit = async (data: Record<string, any>): Promise<Record<string, any>> => {
    const repository = AppDataSource.getRepository(MasterWorkUnit);

    const row = await repository.findOne({
        where: { deleted_at: IsNull(), unit_code: Like(`%${data.unit_code}%`) }
    });

    if (row) {
        return {
            success: true,
            data: row
        }
    }

    const result = await repository.save(repository.create(data))

    if (!result) {
        return {
            success: false,
            data: result,
        }
    }

    return {
        success: true,
        data: result
    }
}


export const findAndCreatePangkat = async (data: Record<string, any>): Promise<Record<string, any>> => {
    const repository = AppDataSource.getRepository(SPPDPangkat);

    const row = await repository.findOne({
        where: { deleted_at: IsNull(), golongan_romawi: Like(`%${data.golongan_romawi}%`), pangkat: Like(`%${data.pangkat}%`) }
    });

    if (row) {
        return {
            success: true,
            data: row
        }
    }

    const result = await repository.save(repository.create(data))

    if (!result) {
        return {
            success: false,
            data: result,
        }
    }

    return {
        success: true,
        data: result
    }
}