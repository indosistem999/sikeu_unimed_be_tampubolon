import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    OneToMany,
} from 'typeorm';
import { SPDPegawai } from './SPDPegawai';

@Entity({ name: 'spd_pangkat_golongan' })
export class SPDPangkat {
    @PrimaryGeneratedColumn('uuid')
    pangkat_id!: string;

    @Column({ type: 'varchar', length: 100, name: 'golongan_romawi', default: null })
    golongan_romawi!: string;

    @Column({ type: 'varchar', length: 100, name: 'golongan_angka', default: null })
    golongan_angka!: string;

    @Column({ type: 'varchar', length: 255, name: 'pangkat', default: null })
    pangkat!: string;

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

    @OneToMany(() => SPDPegawai, (value: any) => value.pangkat_golongan, { eager: true })
    pegawai!: SPDPegawai[]
}
