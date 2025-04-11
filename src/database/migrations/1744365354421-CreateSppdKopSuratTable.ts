import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSppdKopSuratTable1744365354421 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE sppd_kopsurat (
            kopsurat_id CHAR(36) PRIMARY KEY,
            order_number BIGINT DEFAULT NULL,
            description TEXT DEFAULT NULL,
            font_type TEXT DEFAULT NULL,
            font_style TEXT DEFAULT NULL,
            font_size VARCHAR(200) DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            created_by CHAR(36) NULL,
            updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
            updated_by CHAR(36) NULL,
            deleted_at TIMESTAMP NULL,
            deleted_by CHAR(36) NULL
          );`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE sppd_kopsurat`);
    }

}
