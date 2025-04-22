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

@Entity({ name: 'master_data_component' })
export class MasterDataComponent {
    @PrimaryGeneratedColumn('uuid')
    component_id!: string;

    @Column({ type: 'text', name: 'code', default: null })
    code!: string;

    @Column({ type: 'text', name: 'description', default: null })
    description!: string;

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

    @OneToMany(() => PaguAnggaran, (value: any) => value.master_component)
    pagu_anggaran!: PaguAnggaran[]
}
