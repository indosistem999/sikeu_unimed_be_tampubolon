import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'sppd_jenis_biaya' })
export class SPPDJenisBiaya {
    @PrimaryGeneratedColumn('uuid')
    cost_type_id!: string;

    @Column({ type: 'text', name: 'name', default: null })
    name!: string;

    @Column({ type: 'varchar', length: 200, name: 'code', default: null })
    code!: string;

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
