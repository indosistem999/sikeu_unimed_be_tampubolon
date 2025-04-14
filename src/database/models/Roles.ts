import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Users } from "./Users";
import { RoleModuleAssociation } from "./RoleModuleAssociation";

@Entity({ name: 'roles' })
export class Roles {
  @PrimaryGeneratedColumn('uuid')
  role_id!: string;

  @Column({ type: 'varchar', length: 255, name: 'role_name' })
  role_name!: string;

  @Column({ type: 'varchar', length: 255, name: 'role_slug' })
  role_slug!: string;

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


  @OneToOne(() => Users, (value) => value.role)
  user!: Users;

  @OneToMany(() => RoleModuleAssociation, (value) => value.role)
  role_modules!: RoleModuleAssociation[];
}
