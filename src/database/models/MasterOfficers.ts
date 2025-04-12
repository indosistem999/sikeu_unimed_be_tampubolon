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
import { PositionType } from '../../interfaces/enum.interface';
import { MasterJobCategory } from './MasterJobCategory';
import { MasterWorkUnit } from './MasterWorkUnit';

@Entity({ name: 'master_officers' })
export class MasterOfficers {
  @PrimaryGeneratedColumn('uuid')
  officers_id!: string;

  @Column({ type: 'char', length: 36, name: 'nip' })
  nip!: string;

  @Column({ type: 'varchar', length: 255, name: 'full_name', default: null })
  full_name!: string;


  @Column({ type: 'varchar', length: 255, name: 'posititon_name', default: null })
  posititon_name!: string;

  @Column({
    type: "enum",
    enum: PositionType,
    default: PositionType.UMUM, // 👈 Set default enum value
  })
  position_type!: PositionType;

  @Column({ name: 'job_category_id', type: 'uuid', default: null, nullable: true })
  job_category_id!: string

  @OneToOne(() => MasterJobCategory, (value) => value.officers)
  @JoinColumn({ name: 'job_category_id' })
  job_category!: MasterJobCategory;


  @Column({ name: 'unit_id', type: 'uuid', default: null, nullable: true })
  unit_id!: string

  @OneToOne(() => MasterWorkUnit, (value) => value.officers)
  @JoinColumn({ name: 'unit_id' })
  work_unit!: MasterWorkUnit;

  @Column({ type: 'date', nullable: true, default: null, name: 'start_date_position' })
  start_date_position!: Date;

  @Column({ type: 'date', nullable: true, default: null, name: 'end_date_position' })
  end_date_position!: Date;

  @Column({ type: 'tinyint', name: 'is_not_specified', default: true })
  is_not_specified!: number;

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
