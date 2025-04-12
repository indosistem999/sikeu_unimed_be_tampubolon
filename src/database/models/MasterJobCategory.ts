import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { MasterOfficers } from './MasterOfficers';

/** Master Kategori Jabatan */
@Entity({ name: 'master_job_category' })
export class MasterJobCategory {
  @PrimaryGeneratedColumn('uuid')
  job_category_id!: string;

  @Column({ type: 'varchar', length: 100, name: 'code', default: null })
  code!: string;

  @Column({ type: 'varchar', length: 255, name: 'name', default: null })
  name!: string;

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

  @OneToMany(() => MasterOfficers, (value) => value.job_category)
  officers!: MasterOfficers[];
}
