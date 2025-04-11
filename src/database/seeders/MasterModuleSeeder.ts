import { IsNull } from 'typeorm';
import AppDataSource from '../../config/dbconfig';
import { standartDateISO } from '../../lib/utils/common.util';
import { MasterModule } from '../models/MasterModule';
import { Users } from '../models/Users'

export const moduleList = [
  {
    module_name: 'Pengaturan',
    module_path: '/pengatuan',
    order_number: 1
  },
  {
    module_name: 'SPPD',
    module_path: '/sppd',
    order_number: 2
  },
  {
    module_name: 'BKU',
    module_path: '/bku',
    order_number: 3
  },
  {
    module_name: 'SPM-SP2D',
    module_path: '/spm_sp2d',
    order_number: 4
  },
  {
    module_name: 'Gaji Honor',
    module_path: '/gaji_honor',
    order_number: 5
  },
  {
    module_name: 'Website',
    module_path: '/website',
    order_number: 6
  },

]

export const masterModuleSeeder = async () => {
  const repoModule = AppDataSource.getRepository(MasterModule);
  const repoUser = AppDataSource.getRepository(Users);


  for (let i = 0; i < moduleList.length; i++) {
    const element = moduleList[i];
    let userId: any = null

    const user = await repoUser.findOne({
      where: {
        role: { role_slug: 'admin' },
        deleted_at: IsNull()
      },
      relations: ['role']
    })

    if (user) {
      userId = user.user_id
    }

    const row = await repoModule.findOne({
      where: {
        module_name: element.module_name,
        deleted_at: IsNull()
      }
    })

    if (!row) {
      const today: Date = new Date(standartDateISO())
      await repoModule.save(repoModule.create({
        ...element,
        created_at: today,
        created_by: userId,
        updated_at: today,
        updated_by: userId
      }))
    }



  }
};
