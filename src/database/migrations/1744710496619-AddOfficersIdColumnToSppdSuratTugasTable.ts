import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOfficersIdColumnToSppdSuratTugasTable1744710496619 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE sppd_surat_tugas ADD COLUMN officers_id CHAR(36) DEFAULT NULL AFTER lokasi_kegiatan`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE sppd_surat_tugas DROP COLUMN officers_id`);
    }
} 