import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './Users';

@Entity({ name: 'user_log' })
export class UserLog {
  @PrimaryGeneratedColumn('uuid')
  log_id!: string;

  @ManyToOne(() => Users, (value) => value.log_user)
  @JoinColumn({ name: 'user_id' })
  user!: Users;

  @Column({ type: 'text', nullable: true })
  activity_type!: string | null;

  @Column({ type: 'timestamp', nullable: true, default: null })
  activity_time!: Date;

  @Column({ type: 'text', nullable: true })
  description!: string | null;
}
