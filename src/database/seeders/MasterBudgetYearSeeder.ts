import { IsNull } from 'typeorm';
import AppDataSource from '../../config/dbconfig';
import { formatDateToday, standartDateISO } from '../../lib/utils/common.util';
import { MasterBudgetYear } from '../models/MasterBudgetYear';
import { Users } from '../models/Users';

export const listData = [
  {
    budget_name: '2023',
    budget_start_date: '2023-01-01',
    budget_end_date: '2024-12-31'
  },
  {
    budget_name: '2024',
    budget_start_date: '2024-01-01',
    budget_end_date: '2025-12-31'
  },
  {
    budget_name: '2025',
    budget_start_date: '2025-01-01',
    budget_end_date: '2025-12-31',
  }
]

export const masterBudgetYearSeeder = async () => {
  const repository = AppDataSource.getRepository(MasterBudgetYear);
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
          budget_name: element?.budget_name,
          deleted_at: IsNull()
        },
      })

      if (row) {
        // Update
        await repository.save({
          ...row, ...{
            budget_name: element.budget_name,
            budget_start_date: formatDateToday('YYYY-MM-DD', element.budget_start_date),
            budget_end_date: formatDateToday('YYYY-MM-DD', element.budget_end_date),
            updated_at: today,
            updated_by: userId
          }
        })
      }
      else {
        await repository.save(repository.create({
          budget_name: element.budget_name,
          budget_start_date: formatDateToday('YYYY-MM-DD', element.budget_start_date),
          budget_end_date: formatDateToday('YYYY-MM-DD', element.budget_end_date),
          created_at: today,
          created_by: userId
        }))
      }


    }
  }


};
