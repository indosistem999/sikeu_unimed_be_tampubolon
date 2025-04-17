import {
    Entity,
    Column,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './Users';

@Entity({ name: 'history_sync_pegawai' })
export class HistorySyncPegawai {
    @PrimaryGeneratedColumn('uuid')
    history_id!: string;

    @Column({ type: 'varchar', length: 100, default: null, name: 'type_name' })
    type_name!: string

    @Column({ type: 'timestamp', default: null, name: 'execute_time' })
    execute_time!: Date | null;

    @Column({ name: 'executor_id', type: 'uuid', default: null, nullable: true })
    executor_id!: string

    @OneToOne(() => Users, (value) => value.history_sync_pegawai)
    @JoinColumn({ name: 'executor_id' })
    user!: Users;

    @Column({ type: 'longtext', name: 'description', default: null })
    description!: string;

    @Column({ type: 'varchar', length: 255, name: 'execute_status', default: null })
    execute_status!: string;

    @Column({ type: 'longtext', name: 'execute_report', default: null })
    execute_report!: string;


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
}
