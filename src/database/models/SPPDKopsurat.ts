import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'sppd_kopsurat' })
export class SPPDKopsurat {
    @PrimaryGeneratedColumn('uuid')
    kopsurat_id!: string;

    @Column({ type: 'bigint', name: 'order_number', default: null })
    order_number!: number;

    @Column({ type: 'text', name: 'description', default: null })
    description!: string;

    @Column({ type: 'text', name: 'font_type', default: null })
    font_type!: string;

    @Column({ type: 'text', name: 'font_style', default: null })
    font_style!: string;


    @Column({ type: 'varchar', length: 200, name: 'font_size', default: null })
    font_size!: string;

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
