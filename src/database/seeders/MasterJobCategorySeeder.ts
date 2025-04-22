import { IsNull } from 'typeorm';
import AppDataSource from '../../config/dbconfig';
import { formatDateToday, standartDateISO } from '../../lib/utils/common.util';
import { Users } from '../models/Users';
import { MasterJobCategory } from '../models/MasterJobCategory';

export const listData = [
  {
    code: 'A',
    name: 'Rektor',
  },
  {
    code: 'B',
    name: 'Wakil Rektor',
  },
  {
    code: 'C',
    name: 'Pejabat Pembuat Komitmen',
  },
  {
    code: 'D',
    name: 'Bendahara',
  },
]

export const masterJobCategorySeeder = async () => {
  const repository = AppDataSource.getRepository(MasterJobCategory);
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
          code: element?.code,
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
