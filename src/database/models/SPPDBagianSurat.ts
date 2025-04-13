import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('sppd_bagian_surat')
export class SPPDBagianSurat {
    @PrimaryGeneratedColumn('uuid', { name: 'bagian_surat_id' })
    bagian_surat_id!: string;

    @Column({ type: 'text', nullable: true })
    name!: string;

    @Column({ type: 'text', nullable: true })
    description!: string;

    @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @Column({ type: 'char', length: 36, nullable: true })
    created_by!: string;

    @Column({ type: 'timestamp', nullable: true })
    updated_at!: Date;

    @Column({ type: 'char', length: 36, nullable: true })
    updated_by!: string;

    @Column({ type: 'timestamp', nullable: true })
    deleted_at!: Date;

    @Column({ type: 'char', length: 36, nullable: true })
    deleted_by!: string;
}
