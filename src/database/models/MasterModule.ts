import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { MasterMenu } from "./MasterMenu";
import { RoleModuleAssociation } from "./RoleModuleAssociation";

@Entity({ name: 'master_module' })
export class MasterModule {
  @PrimaryGeneratedColumn('uuid')
  module_id!: string;

  @Column({ type: 'varchar', length: 255, name: 'module_name' })
  module_name!: string;

  @Column({ type: 'text', default: null, nullable: false, name: 'module_path' })
  module_path!: string;

  @Column({ type: 'text', default: null, nullable: false, name: 'icon' })
  icon!: string;

  @Column({ type: 'bigint', default: null, nullable: false, name: 'order_number' })
  order_number!: number;

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


  @OneToMany(() => MasterMenu, (value: any) => value.object_module)
  module_menu!: MasterMenu[]

  @OneToMany(() => RoleModuleAssociation, (value) => value.master_module)
  role_modules!: RoleModuleAssociation[];
}
