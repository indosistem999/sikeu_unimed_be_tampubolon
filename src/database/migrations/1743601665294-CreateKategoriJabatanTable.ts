import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateKategoriJabatanTable1744367431285 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE pejabat (
            pejabat_id CHAR(36) PRIMARY KEY,
            unit_id CHAR(36) DEFAULT NULL,
            bagian_surat_id CHAR(36) DEFAULT NULL,
            nomor_surat VARCHAR(100) DEFAULT NULL,
            tanggal_surat DATE DEFAULT NULL,
            kegiatan TEXT DEFAULT NULL,
            awal_kegiatan DATE DEFAULT NULL,
            akhir_kegiatan DATE DEFAULT NULL,
            lokasi_kegiatan TEXT DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            created_by CHAR(36) NULL,
            updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
            updated_by CHAR(36) NULL,
            deleted_at TIMESTAMP NULL,
            deleted_by CHAR(36) NULL
          );`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE pejabat`);
    }

}
