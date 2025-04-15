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
import { UserLog } from './UserLog';
import { Roles } from './Roles';
import { MasterWorkUnit } from './MasterWorkUnit';
import { Expose } from 'class-transformer';

@Entity({ name: 'users' })
export class Users {
  @PrimaryGeneratedColumn('uuid')
  user_id!: string;

  @Column({ name: 'role_id', type: 'uuid', default: null, nullable: true })
  role_id!: string

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
  refresh_token!: string;

  @Column({ type: 'text', nullable: true, default: null })
  photo!: string;

  @Column({ type: 'text', nullable: true, default: null })
  phone_number!: string;

  @Column({ type: 'text', nullable: true, default: null })
  email_verification_token!: string | null;

  @Column({ type: 'timestamp', nullable: true, default: null })
  email_verification_token_expired!: Date | null;

  @Column({ type: 'text', nullable: true, default: null })
  reset_token_code!: string | any;

  @Column({ type: 'timestamp', nullable: true, default: null })
  reset_token_expired!: Date | any;

  @Column({ type: 'tinyint', default: false })
  is_active!: number;

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

  @Column({ type: 'longtext', default: null, name: 'address' })
  address!: string;

  @Column({ type: 'timestamp', nullable: true, default: null, name: 'verified_at' })
  verified_at!: Date;

  @Column({ type: 'timestamp', nullable: true, default: null, name: 'password_change_at' })
  password_change_at!: Date

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

  @OneToMany(() => UserLog, (value) => value.user)
  log_user!: UserLog[];

  // Additonal
  @Column({ type: 'tinyint', default: 0 })
  has_work_unit!: number

  @Column({ name: 'unit_id', type: 'uuid', default: null, nullable: true })
  unit_id?: string

  @ManyToOne(() => MasterWorkUnit, (value) => value.users)
  @JoinColumn({ name: 'unit_id' })
  work_unit!: MasterWorkUnit


  @Column({ type: 'varchar', length: 255, default: null, name: 'gender' })
  gender!: string;

  @Column({ type: 'varchar', length: 50, name: 'nip', default: null })
  nip!: string;

  @Column({ type: 'varchar', length: 255, name: 'job_position', default: null })
  job_position!: string;


  @Column({ type: 'timestamp', nullable: true, default: null })
  start_work_at!: Date | null;

  @Column({ type: 'timestamp', nullable: true, default: null })
  end_work_at!: Date | null;

  @Column({ type: 'tinyint', default: false })
  has_determined!: number;




  // Virtual property to concatenate firstName and lastName
  @Expose()
  get full_name(): string {
    return `${this.first_name} ${this.last_name}`;
  }
}
