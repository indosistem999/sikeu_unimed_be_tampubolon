// mv_sppd_beranda_top.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mv_sppd_beranda_top')
export class MvSppdBerandaBoard {
    @PrimaryGeneratedColumn()
    id!: number; // Add this only if there's a primary key

    @Column({ name: 'total_surat' })
    total_surat!: number;

    @Column({ name: 'total_pegawai' })
    total_pegawai!: number;

    @Column({ name: 'total_satker' })
    total_satker!: number;

    @Column({ type: 'timestamp', name: 'last_updated' })
    last_updated!: Date;
}
