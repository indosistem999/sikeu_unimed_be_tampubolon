import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Users } from './Users';

@Entity({ name: 'user_log' })
export class UserLog {
  @PrimaryGeneratedColumn('uuid')
  log_id!: string;

  @Column({ name: 'user_id', type: 'uuid', default: null, nullable: true })
  user_id!: string

  @ManyToOne(() => Users, (value) => value.log_user)
  @JoinColumn({ name: 'user_id' })
  user!: Users;

  @Column({ type: 'text', name: 'activity_type', nullable: true, default: null })
  activity_type!: string | null;

  @Column({ type: 'timestamp', name: 'activity_time', nullable: true, default: null })
  activity_time!: Date;

  @Column({ type: 'text', name: 'description', nullable: true, default: null })
  description!: string | null;

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

  @Column({ name: 'deleted_by', type: 'uuid' })
  deleted_by!: string;

  @Column({ type: 'text', name: 'ip_address', default: null })
  ip_address!: string;

  @Column({ type: 'text', name: 'browser_name', default: null })
  browser_name!: string;

  @Column({ type: 'longtext', name: 'snapcut', default: null })
  snapcut!: string;

  @Column({ type: 'longtext', name: 'request_properties', default: null })
  request_properties!: string;
}
