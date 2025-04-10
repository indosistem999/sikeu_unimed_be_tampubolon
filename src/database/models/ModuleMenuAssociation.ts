import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { RoleModuleAssociation } from "./RoleModuleAssociation";
import { MasterMenu } from "./MasterMenu";

@Entity({ name: 'module_menu_association' })
export class ModuleMenuAssociation {
  @PrimaryGeneratedColumn('uuid')
  menu_access_id!: string;

  @Column({ name: 'module_access_id', type: 'uuid', default: null, nullable: true })
  module_access_id!: string


  @Column({ name: 'menu_id', type: 'uuid', default: null, nullable: true })
  menu_id!: string

  @OneToOne(() => RoleModuleAssociation, (value) => value.role_module_access, { eager: true })
  @JoinColumn({ name: 'module_access_id' })
  module_menus!: RoleModuleAssociation;

  @ManyToOne(() => MasterMenu, (value) => value.access_menu)
  @JoinColumn({ name: 'menu_id' })
  menu!: MasterMenu;


  @Column({ type: 'text', default: null, nullable: true })
  access_name!: string;

  @Column({ type: 'boolean', default: false })
  access_status!: boolean;

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
