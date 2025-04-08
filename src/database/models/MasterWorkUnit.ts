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
} from 'typeorm';
import { Users } from './Users';

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

    @OneToMany(() => Users, (value) => value.work_unit)
    users!: Users[]
}
