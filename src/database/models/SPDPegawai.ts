import {
    Entity,
    Column,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
} from 'typeorm';
import { MasterWorkUnit } from './MasterWorkUnit';
import { SPDPangkat } from './SPDPangkat';

@Entity({ name: 'spd_pegawai' })
export class SPDPegawai {
    @PrimaryGeneratedColumn('uuid')
    pegawai_id!: string;

    @Column({ type: 'varchar', length: 255, name: 'nik', unique: true })
    nik!: string;

    @Column({ type: 'varchar', length: 255, name: 'nip', unique: true })
    nip!: string;

    @Column({ type: 'varchar', name: 'nama', length: 255 })
    nama!: string;

    @Column({ type: 'varchar', name: 'username', length: 255 })
    username!: string;

    @Column({ type: 'varchar', name: 'gelar_depan', length: 100 })
    gelar_depan!: string;

    @Column({ type: 'varchar', default: null, name: 'email', length: 255 })
    email!: string;

    @Column({ type: 'varchar', length: 50, name: 'phone', default: null })
    phone!: string;

    @Column({ type: 'varchar', name: 'jenis_kepegawaian', length: 150, default: null })
    jenis_kepegawaian!: string;

    @Column({ type: 'varchar', name: 'status_kepegawaian', length: 150, default: null })
    status_kepegawaian!: string;

    @Column({ type: 'tinyint', name: 'status_active', default: false })
    status_active!: number;

    @Column({ type: 'varchar', name: 'simpeg_id', length: 255, default: null })
    simpeg_id!: string;

    @Column({ type: 'text', nullable: true, default: null })
    photo!: string;

    @Column({ type: 'timestamp', name: 'synchronize_date', nullable: true, default: null })
    synchronize_date!: Date;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    created_at!: Date;

    @Column({ name: 'created_by', type: 'uuid' })
    created_by!: string;

    @UpdateDateColumn({ type: 'timestamp', nullable: true, name: 'updated_at' })
    updated_at!: Date;

    @Column({ name: 'updated_by', type: 'uuid' })
    updated_by!: string;

    @DeleteDateColumn({ type: 'timestamp', nullable: true, name: 'deleted_at' })
    deleted_at!: Date;

    @Column({ name: 'deleted_by', type: 'uuid' })
    deleted_by!: string;


    @Column({ name: 'unit_id', type: 'uuid', default: null })
    unit_id!: string

    @OneToOne(() => MasterWorkUnit, (value: any) => value.pegawai)
    @JoinColumn({ name: 'unit_id' })
    work_unit!: MasterWorkUnit

    @Column({ name: 'pangkat_id', type: 'uuid', default: null })
    pangkat_id!: string


    @OneToOne(() => SPDPangkat, (value: any) => value.pegawai)
    @JoinColumn({ name: 'pangkat_id' })
    pangkat_golongan!: SPDPangkat
}
