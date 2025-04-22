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
            ChangePassword: 'Pengguna Mengubah Password Secara Manual',
            LoginAs: (user: string, account: string) => `Pengguna ${user} login menggunakan akun ${account}`
        }
    },

    Role: {
        Label: 'Master Role',
        API: {
            Create: 'Pengguna Menambahkan Data Role Yang Baru',
            Update: 'Pengguna Mengubah Data Role',
            Delete: 'Pengguna Menghapus Data Role',
        }
    },

    RoleModule: {
        Label: 'Akses Modul',
        API: {
            Create: (module: string, role: string) => `Pengguna Menugaskan Akses Modul ${module} Ke Role ${role}`,
            Delete: (module: string, role: string) => `Pengguna Menghapus Akses Modul ${module} Untuk Role ${role}`
        }
    },

    MasterDataOutput: {
        Label: 'Master Data Output',
        API: {
            Create: 'Pengguna Menambahkan Data Output Yang Baru',
            Update: 'Pengguna Mengubah Data Output',
            Delete: 'Pengguna Menghapus Data Output',
            BatchDelete: 'Pengguna Menghapus Beberapa Data Output Sekaligus'
        }
    },

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
            Delete: (value: string) => `Berhasil menghapus pengguna ${value}`,
            ChangePassword: (value: string) => `Berhasil mengubah password pengguna ${value}`,
            LoginAs: (user: string) => `Pengguna ${user} login menggunakan akun anda`
        }
    },
    BudgetYear: {
        Topic: 'Master Tahun Anggaran',
        Event: {
            Create: (value: string) => `Berhasil menambahkan tahun anggaran baru ${value}`,
            Update: (value: string) => `Berhasil mengubah tahun anggaran ${value}`,
            Delete: (value: string) => `Berahsil menghapus tahun anggaran ${value}`
        }
    },

    Role: {
        Topic: 'Master Role',
        Event: {
            Create: (value: string) => `Berhasil menambahkan role ${value}`,
            Update: (value: string) => `Berhasil mengubah role ${value}`,
            Delete: (value: string) => `Berahsil menghapus role ${value}`
        }
    },

    RoleModule: {
        Topic: 'Hak Akses Modul',
        Event: {
            Create: (module: string, role: string) => `Berhasil Menugaskan Akses Modul ${module} Ke Role ${role}`,
            Delete: (module: string, role: string) => `Berhasil Menghapus Akses Modul ${module} Untuk Role ${role}`
        }
    },

    JobCategory: {
        Topic: 'Master Kategori Jabatan',
        Event: {
            Create: (value: string) => `Berhasil menambahkan kategori jabatan baru ${value}`,
            Update: (value: string) => `Berhasil mengubah kategori jabatan ${value}`,
            Delete: (value: string) => `Berahsil menghapus kategori jabatan ${value}`
        }
    },

    MasterDataOutput: {
        Topic: 'Master Data Output',
        Event: {
            Create: (value: string) => `Berhasil menambahkan data output baru ${value}`,
            Update: (value: string) => `Berhasil mengubah data output jabatan ${value}`,
            Delete: (value: string) => `Berahsil menghapus data output jabatan ${value}`,
            BatchDelete: `Berhasil menghapus beberapa data output yang dipilih`
        }
    },
}

export const NotificationType = {
    Information: 'info',
    Error: 'error',
    Success: 'success'
}