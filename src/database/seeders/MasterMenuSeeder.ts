import { IsNull } from 'typeorm';
import AppDataSource from '../../config/dbconfig';
import { MasterModule } from '../models/MasterModule';
import { MasterMenu } from '../models/MasterMenu';

export const moduleList = [
  {
    module_name: 'Pengaturan',
    module_menus: [
      {
        name: 'Beranda',
        slug: '/pengaturan/beranda',
        order_number: 5
      },
      {
        name: 'Umum',
        slug: '/pengaturan/umum',
        order_number: 6
      },
      {
        name: 'Modul',
        slug: '/pengaturan/modul',
        order_number: 7
      },
      {
        name: 'Hak Akses',
        slug: '/pengaturan/hak-akses',
        order_number: 8
      },

      {
        name: 'Tahun Anggaran',
        slug: '/pengaturan/tahun-anggaran',
        order_number: 9
      },


      {
        name: 'Satuan Kerja',
        slug: '/pengaturan/umum/satuan-kerja',
        order_number: 10,
        parent_to: 'Umum'
      },
      {
        name: 'Pejabat',
        slug: '/pengaturan/umum/pejabat',
        order_number: 11,
        parent_to: 'Umum'
      },

      {
        name: 'Identitas',
        slug: '/pengaturan/umum/identitas',
        order_number: 12,
        parent_to: 'Umum'
      },
      {
        name: 'Sumber Dana',
        slug: '/pengaturan/umum/sumber-dana',
        order_number: 13,
        parent_to: 'Umum'
      },

      {
        name: 'Role Akses',
        parent_to: 'Hak Akses',
        slug: '/pengaturan/hak-akses/role-akses',
        order_number: 14
      },

      {
        name: 'Daftar User',
        parent_to: 'Hak Akses',
        slug: '/pengaturan/hak-akses/user',
        order_number: 15
      },


      {
        name: 'Pejabat',
        slug: '/pejabat',
        order_number: 16,
        parent_to: 'Umum'
      },
    ]
  },
  {
    module_name: 'SPPD',
    module_menus: [
      {
        name: 'Surat Tugas & SPPD',
        slug: '/surat-tugas-sppd',
        order_number: 1
      },
      {
        name: 'Surat Tugas',
        slug: '/surat-tugas',
        order_number: 2,
        parent_to: 'Surat Tugas & SPPD'
      },
      {
        name: 'SPD',
        slug: '/spd',
        order_number: 3,
        parent_to: 'Surat Tugas & SPPD'
      },
      {
        name: 'Laporan',
        slug: '/laporan',
        order_number: 3,
        parent_to: 'Surat Tugas & SPPD'
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
    module_name: 'BKU',
    module_menus: []
  },
  {
    module_name: 'SPM-SP2D',
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
