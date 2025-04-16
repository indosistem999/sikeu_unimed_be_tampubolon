import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFileUndanganColumnToSppdSuratTugasTable1744710496620 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE sppd_surat_tugas ADD COLUMN file_undangan LONGTEXT DEFAULT NULL AFTER officers_id`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE sppd_surat_tugas DROP COLUMN file_undangan`);
    }
} 