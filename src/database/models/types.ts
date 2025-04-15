export interface ISppdSuratTugas {
    surat_tugas_id: string;
    sppds?: ISppdSuratTugasSppd[];
    pegawais?: ISppdSuratTugasPegawai[];
}

export interface ISppdSuratTugasSppd {
    sppd_id: string;
    suratTugas?: ISppdSuratTugas;
}

export interface ISppdSuratTugasPegawai {
    assign_surat_id: string;
    suratTugas?: ISppdSuratTugas;
} 