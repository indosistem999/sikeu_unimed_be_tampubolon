import {
    Column,
    Entity,
    PrimaryColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn
} from "typeorm";
import { SppdSuratTugas } from "./SppdSuratTugas";

@Entity("sppd_surat_tugas_pegawai")
export class SppdSuratTugasPegawai {
    @PrimaryColumn({ type: "char", length: 36 })
    assign_surat_id!: string;

    @Column({ type: "char", length: 36, nullable: true })
    surat_tugas_id!: string;

    @Column({ type: "char", length: 36, nullable: true })
    pegawai_id!: string;

    @Column({ type: "text", nullable: true })
    jabatan_kegiatan!: string;

    @Column({ type: "date", nullable: true })
    tanggal_pergi!: Date;

    @Column({ type: "date", nullable: true })
    tanggal_pulang!: Date;

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

    @ManyToOne(() => SppdSuratTugas, suratTugas => suratTugas.pegawais, {
        onDelete: "SET NULL"
    })
    @JoinColumn({ name: "surat_tugas_id" })
    suratTugas!: SppdSuratTugas;
} 