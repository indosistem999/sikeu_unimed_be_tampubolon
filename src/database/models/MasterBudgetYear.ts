import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { PaguAnggaran } from './PaguAnggaran';

/** Master Tahun Anggaran */
@Entity({ name: 'master_budget_year' })
export class MasterBudgetYear {
  @PrimaryGeneratedColumn('uuid')
  budget_id!: string;

  @Column({ type: 'varchar', length: 255, name: 'budget_name', default: null })
  budget_name!: string;

  @Column({ type: 'date', name: 'budget_start_date', default: null })
  budget_start_date!: Date;

  @Column({ type: 'date', name: 'budget_end_date', default: null })
  budget_end_date!: Date;

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


  @OneToMany(() => PaguAnggaran, (value: any) => value.budget_year)
  pagu_anggaran!: PaguAnggaran[]
}
