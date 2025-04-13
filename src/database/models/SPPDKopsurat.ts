import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sppd_kopsurat')
export class SPPDKopSurat {
    @PrimaryGeneratedColumn('uuid', { name: 'kopsurat_id' })
    kopsurat_id!: string;

    @Column('bigint', { name: 'order_number', nullable: true })
    order_number!: number;

    @Column('text', { name: 'description', nullable: true })
    description!: string;

    @Column('text', { name: 'font_type', nullable: true })
    font_type!: string;

    @Column('text', { name: 'font_style', nullable: true })
    font_style!: string;

    @Column('varchar', { name: 'font_size', length: 200, nullable: true })
    font_size!: string;

    @Column('timestamp', { name: 'created_at', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @Column('char', { name: 'created_by', length: 36, nullable: true })
    created_by!: string;

    @Column('timestamp', { name: 'updated_at', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at!: Date;

    @Column('char', { name: 'updated_by', length: 36, nullable: true })
    updated_by!: string;

    @Column('timestamp', { name: 'deleted_at', nullable: true })
    deleted_at!: Date;

    @Column('char', { name: 'deleted_by', length: 36, nullable: true })
    deleted_by!: string;
}
