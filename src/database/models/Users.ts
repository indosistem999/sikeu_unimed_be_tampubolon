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
import { UserLog } from './UserLog';
import { Roles } from './Roles';

@Entity({ name: 'users' })
export class Users {
  @PrimaryGeneratedColumn('uuid')
  user_id!: string;

  @OneToOne(() => Roles, (value) => value.user)
  @JoinColumn({ name: 'role_id' })
  role!: Roles;

  @Column({ type: 'varchar', length: 255, name: 'first_name' })
  first_name!: string;

  @Column({ type: 'varchar', length: 255 })
  last_name!: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email!: string;

  @Column({ type: 'varchar', nullable: false })
  password!: string;

  @Column({ type: 'text', nullable: true, default: null })
  salt!: string;

  @Column({ type: 'text', nullable: true, default: null })
  remember_token!: string;

  @Column({ type: 'text', nullable: true, default: null })
  reset_token!: string;

  @Column({ type: 'text', nullable: true, default: null })
  security_question_id!: string;

  @Column({ type: 'text', nullable: true, default: null })
  security_question_answer!: string;

  @Column({ type: 'text', nullable: true, default: null })
  last_ip!: string;

  @Column({ type: 'text', nullable: true, default: null })
  last_hostname!: string;

  @Column({ type: 'timestamp', nullable: true, default: null })
  last_login!: Date;

  @Column({ type: 'timestamp', nullable: true, default: null })
  registered_date!: Date;

  @Column({ type: 'text', nullable: true, default: null })
  email_verification_token!: string | null;

  @Column({ type: 'text', nullable: true, default: null })
  email_verification_token_expired!: string | null;

  @Column({ type: 'text', nullable: true, default: null })
  reset_token_expired!: string;

  @Column({ type: 'text', nullable: true, default: null })
  photo!: string;

  @Column({ type: 'text', nullable: true, default: null })
  phone_number!: string;

  @Column({ type: 'boolean', default: false })
  is_active!: boolean;

  @Column({ type: 'timestamp', nullable: true, default: null })
  verified_at!: Date;

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

  @OneToMany(() => UserLog, (value) => value.user)
  log_user!: UserLog[];
}
