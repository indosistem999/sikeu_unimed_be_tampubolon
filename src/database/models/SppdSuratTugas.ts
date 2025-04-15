import {
    Column,
    Entity,
    PrimaryColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany
} from "typeorm";

@Entity("sppd_surat_tugas")
export class SppdSuratTugas {
    @PrimaryColumn({ type: "char", length: 36 })
    surat_tugas_id!: string;

    @Column({ type: "char", length: 36, nullable: true })
    unit_id!: string;

    @Column({ type: "char", length: 36, nullable: true })
    bagian_surat_id!: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    nomor_surat!: string;

    @Column({ type: "date", nullable: true })
    tanggal_surat!: Date;

    @Column({ type: "text" })
    kegiatan!: string;

    @Column({ type: "date", nullable: true })
    awal_kegiatan!: Date;

    @Column({ type: "date", nullable: true })
    akhir_kegiatan!: Date;

    @Column({ type: "tinyint", default: 0 })
    only_one!: number;

    @Column({ type: "text", nullable: true })
    lokasi_kegiatan!: string;

    @Column({ type: "char", length: 36, nullable: true })
    officers_id!: string;

    @Column({ type: "longtext", nullable: true })
    file_undangan!: string;

    @CreateDateColumn()
    created_at!: Date;

    @Column({ type: "char", length: 36, nullable: true })
    created_by!: string;

    @UpdateDateColumn({ nullable: true })
    updated_at!: Date;

    @Column({ type: "char", length: 36, nullable: true })
    updated_by!: string;

    @DeleteDateColumn({ nullable: true })
    deleted_at!: Date;

    @Column({ type: "char", length: 36, nullable: true })
    deleted_by!: string;

    @OneToMany("SppdSuratTugasSppd", (sppd: any) => sppd.suratTugas)
    sppds!: any[];

    @OneToMany("SppdSuratTugasPegawai", (pegawai: any) => pegawai.suratTugas)
    pegawais!: any[];
} 