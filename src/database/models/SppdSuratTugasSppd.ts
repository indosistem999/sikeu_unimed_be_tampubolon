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

@Entity("sppd_surat_tugas_sppd")
export class SppdSuratTugasSppd {
    @PrimaryColumn({ type: "char", length: 36 })
    sppd_id!: string;

    @Column({ type: "char", length: 36, nullable: true })
    surat_tugas_id!: string;

    @Column({ type: "char", length: 36, nullable: true })
    bagian_surat_id!: string;

    @Column({ type: "date", nullable: true })
    tanggal_sppd!: Date;

    @Column({ type: "varchar", length: 200, nullable: true })
    instansi!: string;

    @Column({ type: "text", nullable: true })
    akun!: string;

    @Column({ type: "text", nullable: true })
    lainnya!: string;

    @Column({ type: "char", length: 36, nullable: true })
    officers_id!: string;

    @Column({ type: "char", length: 36, nullable: true })
    transportation_type_id!: string;

    @Column({ type: "varchar", length: 200, nullable: true })
    lokasi_awal!: string;

    @Column({ type: "varchar", length: 200, nullable: true })
    lokasi_akhir!: string;

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

    @ManyToOne(() => SppdSuratTugas, suratTugas => suratTugas.sppds, {
        onDelete: "SET NULL"
    })
    @JoinColumn({ name: "surat_tugas_id" })
    suratTugas!: SppdSuratTugas;
} 