import { IsNull, Like } from 'typeorm';
import AppDataSource from '../../config/dbconfig';
import { standartDateISO } from '../../lib/utils/common.util';
import { PaguAnggaran } from '../models/PaguAnggaran';
import { Users } from '../models/Users';
import { MasterDataOutput } from '../models/MasterDataOutput';
import { MasterDataComponent } from '../models/MasterDataComponent';
import { MasterDataMAK } from '../models/MasterDataMAK';
import { MasterWorkUnit } from '../models/MasterWorkUnit';
import { MasterSumberDana } from '../models/MasterSumberDana';
import { I_ResultService } from '../../interfaces/app.interface';
import { MasterBudgetYear } from '../models/MasterBudgetYear';

export const listPaguAnggaran = [
    {
        output: {
            code: '7120.XYZ',
            description: 'Digitral Transformation',
        },
        component: {
            code: '001.021.A',
            description: 'Belanja Barang Digital',
        },
        mak: {
            code: '621102',
            description: 'Belanja Peralatan Komputer dan Digital Lainnya',
        },
        work_unit: {
            unit_code: 'FAK-077',
            unit_type: 'FTI',
            unit_name: 'Fakultas Teknik Informatika',
        },
        budget_year: {
            budget_name: '2025',
            budget_start_date: '2025-01-01',
            budget_end_date: '2025-12-31',
        },
        sumber_dana: {
            code: 'SD001',
            description: 'Biaya Belanja',
        },
        description: 'Pengeluran untuk pembelian peralatan digital penunjang operasional',
        prices: 245700000,
    },
    {
        output: {
            code: '7730.CAA',
            description: 'Sarana Bidang Pendidikan',
        },
        component: {
            code: '001.051.D',
            description: 'Belanja Penyediaan Barang dan Jasa BLU Lainnya',
        },
        mak: {
            code: '525004',
            description: 'Belanja Penyediaan Barang dan Jasa BLU Lainnya',
        },
        work_unit: {
            unit_code: 'FAK-001',
            unit_type: 'FIB',
            unit_name: 'Fakultas Ilmu Budaya',
        },
        budget_year: {
            budget_name: '2025',
            budget_start_date: '2025-01-01',
            budget_end_date: '2025-12-31',
        },
        sumber_dana: {
            code: 'SD001',
            description: 'Biaya Belanja',
        },
        description: 'Pengeluran untuk pembelian barang dan jasa guna penunjang proses pembelajaran',
        prices: 175000000,
    },
];

const findCreateAndUpdateOutput = async (userId: string, payload: Record<string, any>): Promise<I_ResultService> => {
    const repository = AppDataSource.getRepository(MasterDataOutput);
    const row = await repository.findOne({
        where: { deleted_at: IsNull(), code: Like(`%${payload.code}%`) },
    });

    let result: MasterDataOutput | any = {};

    if (!row) {
        result = await repository.save(
            repository.create({
                ...payload,
                created_at: new Date(standartDateISO()),
                created_by: userId,
            })
        );
    } else {
        result = await repository.update(row?.output_id, {
            ...payload,
            updated_at: new Date(standartDateISO()),
            updated_by: userId,
        });

    }

    if (!result) {
        return {
            success: false,
            message: 'Failed',
            record: result,
        };
    }

    return {
        success: true,
        message: 'Successfully',
        record: { id: result?.output_id, code: result?.code },
    };
};

const findCreateAndUpdateComponent = async (userId: string, payload: Record<string, any>): Promise<I_ResultService> => {
    const repository = AppDataSource.getRepository(MasterDataComponent);
    const row = await repository.findOne({
        where: { deleted_at: IsNull(), code: Like(`%${payload.code}%`) },
    });

    let result: Record<string, any> | any = {};

    if (!row) {
        result = await repository.save(
            repository.create({
                ...payload,
                created_at: new Date(standartDateISO()),
                created_by: userId,
            })
        );
    } else {

        result = await repository.update(row?.component_id, {
            ...payload,
            updated_at: new Date(standartDateISO()),
            updated_by: userId,
        });
    }

    if (!result) {
        return {
            success: false,
            message: 'Failed',
            record: result,
        };
    }

    return {
        success: true,
        message: 'Successfully',
        record: { id: result?.component_id, code: result?.code },
    };
};

const findCreateAndUpdateMAK = async (userId: string, payload: Record<string, any>): Promise<I_ResultService> => {
    const repository = AppDataSource.getRepository(MasterDataMAK);
    const row = await repository.findOne({
        where: { deleted_at: IsNull(), code: Like(`%${payload.code}%`) },
    });

    let result: Record<string, any> | any = {};

    if (!row) {
        result = await repository.save(
            repository.create({
                ...payload,
                created_at: new Date(standartDateISO()),
                created_by: userId,
            })
        );
    } else {

        result = await repository.update(row?.mak_id, {
            ...payload,
            updated_at: new Date(standartDateISO()),
            updated_by: userId,
        });
    }

    if (!result) {
        return {
            success: false,
            message: 'Failed',
            record: result,
        };
    }

    return {
        success: true,
        message: 'Successfully',
        record: { id: result?.mak_id, code: result?.code },
    };
};

const findCreateAndUpdateSumberDana = async (
    userId: string,
    payload: Record<string, any>
): Promise<I_ResultService> => {
    const repository = AppDataSource.getRepository(MasterSumberDana);
    const row = await repository.findOne({
        where: { deleted_at: IsNull(), code: Like(`%${payload.code}%`) },
    });

    let result: Record<string, any> | any = {};

    if (!row) {
        result = await repository.save(
            repository.create({
                ...payload,
                created_at: new Date(standartDateISO()),
                created_by: userId,
            })
        );
    } else {

        result = await repository.update(row?.sumber_dana_id, {
            ...payload,
            updated_at: new Date(standartDateISO()),
            updated_by: userId,
        });
    }

    if (!result) {
        return {
            success: false,
            message: 'Failed',
            record: result,
        };
    }

    return {
        success: true,
        message: 'Successfully',
        record: { id: result?.sumber_dana_id },
    };
};

const findCreateAndUpdateWorkUnit = async (userId: string, payload: Record<string, any>): Promise<I_ResultService> => {
    const repository = AppDataSource.getRepository(MasterWorkUnit);
    const row = await repository.findOne({
        where: {
            deleted_at: IsNull(),
            unit_code: Like(`%${payload.unit_code}%`),
            unit_type: Like(`%${payload.unit_type}%`),
            unit_name: Like(`%${payload.unit_name}%`),
        },
    });

    let result: Record<string, any> | any = {};

    if (!row) {
        result = await repository.save(
            repository.create({
                ...payload,
                created_at: new Date(standartDateISO()),
                created_by: userId,
            })
        );
    } else {
        result = await repository.update(row?.unit_id, {
            ...payload,
            updated_at: new Date(standartDateISO()),
            updated_by: userId,
        });
    }

    if (!result) {
        return {
            success: false,
            message: 'Failed',
            record: result,
        };
    }

    return {
        success: true,
        message: 'Successfully',
        record: { id: result?.unit_id },
    };
};

const findCreateAndUpdateBudgetYear = async (userId: string, payload: Record<string, any>): Promise<I_ResultService> => {
    const repository = AppDataSource.getRepository(MasterBudgetYear);
    const row = await repository.findOne({
        where: {
            deleted_at: IsNull(),
            budget_name: payload.budget_name,
            budget_start_date: payload.budget_start_date,
            budget_end_date: payload.budget_end_date,
        },
    });

    let result: Record<string, any> | any = {};

    if (!row) {
        result = await repository.save(
            repository.create({
                ...payload,
                created_at: new Date(standartDateISO()),
                created_by: userId,
            })
        );
    } else {
        result = await repository.update(row?.budget_id, {
            ...payload,
            updated_at: new Date(standartDateISO()),
            updated_by: userId,
        });
    }

    if (!result) {
        return {
            success: false,
            message: 'Failed',
            record: result,
        };
    }

    return {
        success: true,
        message: 'Successfully',
        record: { id: result?.budget_id },
    };
};

export const paguAnggaranSeeder = async () => {
    const repoPagu = AppDataSource.getRepository(PaguAnggaran);
    const repoUser = AppDataSource.getRepository(Users);

    const user = await repoUser.findOne({
        where: {
            role: { role_slug: 'admin' },
            deleted_at: IsNull(),
        },
        relations: ['role'],
    });

    if (user) {
        const userId: string = user.user_id;

        for (let i = 0; i < listPaguAnggaran.length; i++) {
            const { output, component, mak, work_unit, budget_year, sumber_dana, ...payload } = listPaguAnggaran[i];

            const resultOutput = await findCreateAndUpdateOutput(userId, output);
            const resultComponent = await findCreateAndUpdateComponent(userId, component);
            const resultMAK = await findCreateAndUpdateMAK(userId, mak);
            const resultWorkUnit = await findCreateAndUpdateWorkUnit(userId, work_unit);
            const resultSumberDana = await findCreateAndUpdateSumberDana(userId, sumber_dana);
            const resultBudgetYear = await findCreateAndUpdateBudgetYear(userId, budget_year);

            if (!resultOutput?.success) {
                continue;
            }

            if (!resultComponent?.success) {
                continue;
            }

            if (!resultMAK?.success) {
                continue;
            }

            if (!resultWorkUnit?.success) {
                continue;
            }

            if (!resultSumberDana?.success) {
                continue;
            }

            if (!resultBudgetYear?.success) {
                continue;
            }


            const result = await repoPagu.save(repoPagu.create({
                ...payload,
                created_at: new Date(standartDateISO()),
                created_by: userId,
                mak_id: resultMAK.record.id,
                component_id: resultComponent.record.id,
                sumber_dana_id: resultSumberDana.record.id,
                unit_id: resultWorkUnit.record.id,
                output_id: resultOutput.record.id,
                kode_anggaran: `${resultOutput.record.code}.${resultComponent.record.code}.${resultMAK.record.code}`,
                budget_id: resultBudgetYear.record.id
            }))

            if (!result) {
                continue;
            }

        }
    }
};
