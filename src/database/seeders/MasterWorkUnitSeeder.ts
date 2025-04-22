import { IsNull } from 'typeorm';
import AppDataSource from '../../config/dbconfig';
import { formatDateToday, standartDateISO } from '../../lib/utils/common.util';
import { MasterBudgetYear } from '../models/MasterBudgetYear';
import { Users } from '../models/Users';
import { MasterWorkUnit } from '../models/MasterWorkUnit';

export const listData = [
  {
    unit_code: 'FAK-001',
    unit_type: 'FIB',
    unit_name: 'Fakultas Ilmu Budaya',
  },
  {
    unit_code: 'FAK-077',
    unit_type: 'FTI',
    unit_name: 'Fakultas Teknik Informatika',
  }
]

export const masterWorkUnitSeeder = async () => {
  const repository = AppDataSource.getRepository(MasterWorkUnit);
  const repoUser = AppDataSource.getRepository(Users)
  const today = new Date(standartDateISO());

  const user = await repoUser.findOne({
    where: {
      deleted_at: IsNull(),
      role: {
        role_slug: 'admin'
      }
    }
  })

  if (user) {
    const userId: any = user.user_id

    for (let i = 0; i < listData.length; i++) {
      const element = listData[i];

      const row = await repository.findOne({
        where: {
          unit_code: element?.unit_code,
          unit_type: element?.unit_type,
          unit_name: element?.unit_name,
          deleted_at: IsNull()
        },
      })

      if (row) {
        // Update
        await repository.save({
          ...row, ...{
            ...element,
            updated_at: today,
            updated_by: userId
          }
        })
      }
      else {
        await repository.save(repository.create({
          ...element,
          created_at: today,
          created_by: userId
        }))
      }


    }
  }


};
