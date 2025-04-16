import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
} from 'typeorm';
import { SPPDPegawai } from './SPPDPegawai';

@Entity({ name: 'sppd_pangkat_golongan' })
export class SPPDPangkat {
    @PrimaryGeneratedColumn('uuid')
    pangkat_id!: string;

    @Column({ type: 'text', name: 'golongan_romawi', default: null })
    golongan_romawi!: string;

    @Column({ type: 'varchar', length: 100, name: 'golongan_angka', default: null })
    golongan_angka!: string;

    @Column({ type: 'text', name: 'pangkat', default: null })
    pangkat!: string;

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

    @OneToMany(() => SPPDPegawai, (value) => value.pangkat_golongan)
    pegawai!: SPPDPegawai[]
}
