export const TypeLogActivity = {
    Auth: {
        Label: 'Authentikasi',
        API: {
            Login: 'Pengguna Berhasil Login',
            ManualChangePassword: 'Pengguna Mengubah Password Secara Manual'
        }
    },
    BudgetYear: {
        Label: 'Master Tahun Anggaran',
        API: {
            Create: 'Pengguna Menambahkan Data Tahun Anggaran Yang Baru',
            Update: 'Pengguna Mengubah Data Tahun Anggaran',
            Delete: 'Pengguna Menghapus Data Tahun Anggaran'
        }

    },
    Identity: {
        Label: 'Master Identitas',
        API: {
            Create: 'Pengguna Menambah Data Identitas Yang Baru',
            Update: 'Pengguna Mengubah Data Identitas',
            Delete: 'Pengguna Menghapus Data Identitas'
        }
    },
    JobCategory: {
        Label: 'Master Kategori Jabatan',
        API: {
            Create: 'Pengguna Menambahkan Data Kelompok/Kategori Jabatan Yang Baru',
            Update: 'Pengguna Mengubah Data Kelompok/Kategori Jabatan',
            Delete: 'Pengguna Menghapus Data Kelompok/Kategori Jabatan',
        }
    },
    Module: {
        Label: 'Master Modul',
        API: {
            Create: 'Pengguna Menambahkan Data Modul Yang Baru',
            Update: 'Pengguna Mengubah Data Modul Jabatan',
            Delete: 'Pengguna Menghapus Data Modul Jabatan',
        }
    },
    Menu: {
        Label: 'Master Menu',
        API: {
            Create: 'Pengguna Menambahkan Data Menu Yang Baru',
            Update: 'Pengguna Mengubah Data Menu Jabatan',
            Delete: 'Pengguna Menghapus Data Menu Jabatan',
        }
    },

    SubMenu: {
        Label: 'Master Menu/Sub Menu',
        API: {
            Create: 'Pengguna Menambahkan Data Sub Menu Yang Baru',
            Update: 'Pengguna Mengubah Data Sub Menu Jabatan',
            Delete: 'Pengguna Menghapus Data Sub Menu Jabatan',
        }
    },
    FeatureAccess: {
        Label: 'Konfigurasi Akses Fitur',
        API: {
            Create: 'Pengguna Menetapkan Akses Fitur Menu Ke Role Akses Tertentu',
        }
    },
    SppdEmployee: {
        Label: 'Master Menu/Sub Menu',
        API: {
            Create: 'Pengguna Menambahkan Data SPPD Pegawai Baru',
            Update: 'Pengguna Mengubah Data SPPD Pegawai Jabatan',
            Delete: 'Pengguna Menghapus Data SPPD Pegawai Jabatan',
            ImportFile: 'Pengguna Melakukan Import Excel Untuk Sinkronisasi Dengan Data Di Sistem',
            SyncData: (name: string) => `Pengguna Melakukan Sinkronisasi SPPD Pegawai Untuk Data ${name}`
        }
    },
    Users: {
        Label: 'Master Pengguna',
        API: {
            Create: 'Pengguna Menambahkan Data Pengguna Baru',
            Update: 'Pengguna Mengubah Data Pengguna',
            Delete: 'Pengguna Menghapus Data Pengguna',
        }
    }



}

export const TagNameIntegration = {
    SppdPegawai: {
        Import: 'sppd-pegawai-import',
        Sync: 'sppd-pegawai-sync'
    }
}

export const NotificationOption = {
    Module: {
        Topic: 'Master Modul',
        Event: {
            Create: (value: string) => `Berhasil menambahkan modul baru ${value}`,
            Update: (value: string) => `Berhasil mengubah modul ${value}`,
            Delete: (value: string) => `Berahsil menghapus modul ${value}`
        }
    },
    Users: {
        Topic: 'Master Pengguna',
        Event: {
            Create: (value: string) => `Berhasil menambahkan pengguna baru ${value}`,
            Update: (value: string) => `Berhasil mengubah pengguna ${value}`,
            Delete: (value: string) => `Berahsil menghapus pengguna ${value}`
        }
    },
    BudgetYear: {
        Topic: 'Master Tahun Anggaran',
        Event: {
            Create: (value: string) => `Berhasil menambahkan tahun anggaran baru ${value}`,
            Update: (value: string) => `Berhasil mengubah tahun anggaran ${value}`,
            Delete: (value: string) => `Berahsil menghapus tahun anggaran ${value}`
        }
    }
}

export const NotificationType = {
    Information: 'info',
    Error: 'error',
    Success: 'success'
}