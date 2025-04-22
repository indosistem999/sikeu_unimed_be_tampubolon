import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { MasterWorkUnit } from './MasterWorkUnit';
import { MasterBudgetYear } from './MasterBudgetYear';
import { MasterSumberDana } from './MasterSumberDana';
import { MasterDataMAK } from './MasterDataMAK';
import { MasterDataComponent } from './MasterDataComponent';
import { MasterDataOutput } from './MasterDataOutput';

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


    @OneToOne(() => MasterWorkUnit, (value: any) => value.pagu_anggaran)
    @JoinColumn({ name: 'unit_id' })
    work_unit!: MasterWorkUnit

    @OneToOne(() => MasterBudgetYear, (value: any) => value.pagu_anggaran)
    @JoinColumn({ name: 'budget_id' })
    budget_year!: MasterBudgetYear

    @OneToOne(() => MasterSumberDana, (value: any) => value.pagu_anggaran)
    @JoinColumn({ name: 'sumber_dana_id' })
    sumber_dana!: MasterSumberDana

    @OneToOne(() => MasterDataMAK, (value: any) => value.pagu_anggaran)
    @JoinColumn({ name: 'mak_id' })
    master_mak!: MasterDataMAK


    @OneToOne(() => MasterDataComponent, (value: any) => value.pagu_anggaran)
    @JoinColumn({ name: 'component_id' })
    master_component!: MasterDataComponent

    @OneToOne(() => MasterDataOutput, (value: any) => value.pagu_anggaran)
    @JoinColumn({ name: 'output_id' })
    master_output!: MasterDataOutput
}
