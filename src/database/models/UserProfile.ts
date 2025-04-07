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

@Entity({ name: 'user_profile' })
export class UserProfile {
    @PrimaryGeneratedColumn('uuid')
    profile_id!: string;

    @OneToOne(() => Users, (value) => value.profile)
    @JoinColumn({ name: 'user_id' })
    user!: Users;

    @Column({ type: 'varchar', length: 50, name: 'nip', default: null })
    nip!: string;

    @Column({ type: 'varchar', length: 255, name: 'job_position', default: null })
    job_position!: string;


    @Column({ type: 'timestamp', nullable: true, default: null })
    start_work_at!: Date | null;

    @Column({ type: 'timestamp', nullable: true, default: null })
    end_work_at!: Date | null;


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
}
