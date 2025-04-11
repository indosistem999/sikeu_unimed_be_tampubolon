import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSppdBagianSuratTable1744364729118 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE sppd_bagian_surat (
            bagian_surat_id CHAR(36) PRIMARY KEY,
            name TEXT DEFAULT NULL,
            description TEXT DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            created_by CHAR(36) NULL,
            updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
            updated_by CHAR(36) NULL,
            deleted_at TIMESTAMP NULL,
            deleted_by CHAR(36) NULL
          );`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE sppd_bagian_surat`);
    }

}
