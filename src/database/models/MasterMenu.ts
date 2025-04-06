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
  slug!: string;

  @Column({ type: 'bigint', default: null, nullable: false, name: 'order_number' })
  order_number!: number;

  @Column({ type: "uuid", nullable: true }) // Ensure this matches UUID type
  parent_id?: string;


  @ManyToOne(() => MasterMenu, (value) => value.children, {
    nullable: true,
    onDelete: "SET NULL", // Ensure consistency with database constraint
  })
  @JoinColumn({ name: "parent_id" })
  parent?: MasterMenu;

  @OneToMany(() => MasterMenu, (value) => value.parent)
  children!: MasterMenu[];


  @Column({ type: "uuid", nullable: true }) // Ensure this matches UUID type
  module_id?: string;

  @ManyToOne(() => MasterModule, (value) => value.module_menu, {
    onDelete: "CASCADE", // If a module is deleted, related menus are removed
  })
  @JoinColumn({ name: "module_id" })
  master_module!: MasterModule;


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
