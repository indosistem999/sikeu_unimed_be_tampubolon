import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Roles } from "./Roles";
import { MasterModule } from "./MasterModule";
import { ModuleMenuAssociation } from "./ModuleMenuAssociation";

@Entity({ name: 'role_module_association' })
export class RoleModuleAssociation {
  @PrimaryGeneratedColumn('uuid')
  module_access_id!: string;

  @ManyToOne(() => Roles, (value) => value.role_modules, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role!: Roles;

  @ManyToOne(() => MasterModule, (value) => value.role_modules, { eager: true })
  @JoinColumn({ name: 'module_id' })
  master_module!: MasterModule;


  @OneToOne(() => ModuleMenuAssociation, (value) => value.module_menus)
  role_module_access!: ModuleMenuAssociation

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
