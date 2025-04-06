import { IsNull } from 'typeorm';
import AppDataSource from '../../config/dbconfig';
import { standartDateISO } from '../../lib/utils/common.util';
import { MasterModule } from '../models/MasterModule';
import { MasterMenu } from '../models/MasterMenu';

export const moduleList = [
  {
    module_name: 'Pengaturan',
    module_menus: []
  },
  {
    module_name: 'SPPD',
    module_menus: [
      {
        name: 'Surat Tugas',
        slug: '/surat-tugas',
        order_number: 1
      },
      {
        name: 'SPD',
        slug: '/spd',
        order_number: 2
      },
      {
        name: 'Laporan',
        slug: '/laporan',
        order_number: 3
      },
      {
        name: 'Laporan Masuk',
        slug: '/laporan-masuk',
        order_number: 1,
        parent_to: 'Laporan'
      },
      {
        name: 'Laporan Keluar',
        slug: '/laporan-keluar',
        order_number: 2,
        parent_to: 'Laporan'
      }
    ]
  },
  {
    module_name: 'BKU & SPM',
    module_menus: []
  },
  {
    module_name: 'Website',
    module_menus: []
  },
  {
    module_name: 'Gaji Honor',
    module_menus: []
  }
]

export const masterMenuSeeder = async () => {
  const repoModule = AppDataSource.getRepository(MasterModule);
  const repoMenu = AppDataSource.getRepository(MasterMenu);

  for (let a = 0; a < moduleList.length; a++) {
    const element = moduleList[a];

    const rowModule = await repoModule.findOne({
      where: { deleted_at: IsNull(), module_name: element.module_name }
    })

    if (rowModule && element?.module_menus?.length > 0) {

      console.log({ module_id: rowModule?.module_id, module_menu: element?.module_menus })

      for (let i = 0; i < element?.module_menus?.length; i++) {
        const itemMenu = element.module_menus[i];
        let parent_id: any = null;

        if (itemMenu?.parent_to) {
          const rowParent = await repoMenu.findOne({
            where: { deleted_at: IsNull(), name: itemMenu.parent_to }
          });

          parent_id = rowParent ? rowParent : null
        }

        // store menu
        await repoMenu.save(repoMenu.create({
          name: itemMenu?.name,
          slug: itemMenu?.slug,
          parent_id: parent_id,
          order_number: itemMenu.order_number,
          module_id: rowModule?.module_id
        }))
      }
    }
  }
};
