export const sortRequest: Record<string, any> = {
    name_nik: 'name_nik',
    unit_name: 'unit_name',
    jenis_kepegawaian: 'jenis_kepegawaian',
    status_kepegawaian: 'status_kepegawaian',
    status_active: 'status_active',
    created_at: 'created_at'
};

export const sortDefault: string[] = [`created_at`, 'asc'];


export const excelHeaders: Record<string, any>[] = [
    { slug: 'nik', name: 'NIK' },
    { slug: 'nip', name: 'NIP' },
    { slug: 'nama', name: 'Nama Lengkap' },
    { slug: 'gelar_depan', name: 'Gelar Depan' },
    { slug: 'email', name: 'Email' },
    { slug: 'phone', name: 'No. HP' },
    { slug: 'pangkat', name: 'Pangkat/Golongan' },
    { slug: 'work_unit', name: 'Satuan Kerja' },
    { slug: 'jabatan', name: 'Jabatan' },
    { slug: 'jenis_kepegawaian', name: 'Jenis Kepegawaian (dosen/pegawai)' },
    { slug: 'status_kepegawaian', name: 'Status Pegawai (pns/cpns/p3k/honor)' },
    { slug: 'status_active', name: 'Status Aktif (aktif, tidak aktif)' },
    { slug: 'simpeg_id', name: 'ID Simpeg' },
    { slug: 'username', name: 'Username' },
];