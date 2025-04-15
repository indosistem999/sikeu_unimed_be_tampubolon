import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    OneToMany,
} from 'typeorm';
import { Users } from './Users';
import { SPPDPegawai } from './SPPDPegawai';
import { MasterOfficers } from './MasterOfficers';


@Entity({ name: 'master_work_unit' })
export class MasterWorkUnit {
    @PrimaryGeneratedColumn('uuid')
    unit_id!: string;

    @Column({ type: 'varchar', length: 255, name: 'unit_code', nullable: false })
    unit_code!: string;

    @Column({ type: 'varchar', length: 255, name: 'unit_type', nullable: true, default: null })
    unit_type!: string;

    @Column({ type: 'text', name: 'unit_name', nullable: true, default: null })
    unit_name!: string;

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

    @OneToMany(() => Users, (value: any) => value.work_unit)
    users!: Users[]

    @OneToMany(() => MasterOfficers, (value: any) => value.work_unit)
    officers!: MasterOfficers[]

    @OneToMany(() => SPPDPegawai, (value: any) => value.work_unit)
    pegawai!: SPPDPegawai[]
}
