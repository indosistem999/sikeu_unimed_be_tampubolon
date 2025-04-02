import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { MasterModule } from "./MasterModule";

@Entity({ name: '' })
export class MasterMenu {
  @PrimaryGeneratedColumn('uuid')
  menu_id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', default: null, nullable: false })
  icon!: string;

  @Column({ type: 'text', default: null, nullable: false })
  link!: string;

  @ManyToOne(() => MasterMenu, (value: any) => value.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent!: MasterMenu;

  @OneToMany(() => MasterMenu, (value) => value.parent)
  children!: MasterMenu[];

  @ManyToOne(() => MasterModule, (value) => value.module_menu)
  @JoinColumn({ name: 'module_id' })
  object_module!: MasterModule


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
