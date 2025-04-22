import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'pagu_anggaran' })
export class PaguAnggaran {
    @PrimaryGeneratedColumn('uuid')
    pagu_anggaran_id!: string;

    @Column({ name: 'output_id', type: 'uuid', default: null, nullable: true })
    output_id!: string

    @Column({ name: 'component_id', type: 'uuid', default: null, nullable: true })
    component_id!: string

    @Column({ name: 'mak_id', type: 'uuid', default: null, nullable: true })
    mak_id!: string

    @Column({ name: 'unit_id', type: 'uuid', default: null, nullable: true })
    unit_id!: string

    @Column({ name: 'sumber_dana_id', type: 'uuid', default: null, nullable: true })
    sumber_dana_id!: string

    @Column({ name: 'budget_id', type: 'uuid', default: null, nullable: true })
    budget_id!: string

    @Column({ type: 'text', name: 'description', default: null })
    description!: string;

    @Column({ type: 'text', name: 'kode_anggaran', default: null })
    kode_anggaran!: string

    @Column({ type: 'decimal', name: 'prices', default: null })
    prices!: number;

    @Column({ type: 'decimal', name: 'realisasi', default: null })
    realisasi!: number;

    @Column({ type: 'decimal', name: 'sisa_anggaran', default: null })
    sisa_anggaran!: number;


    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    created_at!: Date;

    @Column({ name: 'created_by', type: 'uuid', select: false })
    created_by!: string;

    @UpdateDateColumn({ type: 'timestamp', nullable: true, name: 'updated_at' })
    updated_at!: Date;

    @Column({ name: 'updated_by', type: 'uuid', select: false })
    updated_by!: string;

    @DeleteDateColumn({ type: 'timestamp', nullable: true, name: 'deleted_at', select: false })
    deleted_at!: Date;

    @Column({ name: 'deleted_by', type: 'uuid', select: false })
    deleted_by!: string;
}
