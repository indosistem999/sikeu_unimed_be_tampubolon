import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOnlyOneColumnToSppdSuratTugasTable1744710496618 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE sppd_surat_tugas ADD COLUMN only_one TINYINT DEFAULT 0 AFTER akhir_kegiatan`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE sppd_surat_tugas DROP COLUMN only_one`);
    }
} 