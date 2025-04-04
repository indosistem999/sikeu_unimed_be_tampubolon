import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'master_identity' })
export class MasterIdentity {
  @PrimaryGeneratedColumn('uuid')
  identity_id!: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  name!: string;

  @Column({ type: 'longtext', nullable: true, default: null })
  logo!: string;

  @Column({ type: 'varchar', length: 30, nullable: true, default: null })
  phone!: string;


  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  email!: string;

  @Column({ type: 'text', nullable: true, default: null })
  address!: string;

  @Column({ type: 'text', nullable: true, default: null })
  website!: string;

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
