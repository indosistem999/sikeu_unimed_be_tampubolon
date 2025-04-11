import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSppdJenisTransportasiTable1743601665297 implements MigrationInterface {


    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE sppd_jenis_transportasi (
            transportation_type_id CHAR(36) PRIMARY KEY,
            code VARCHAR(200) DEFAULT NULL,
            nama TEXT DEFAULT NULL,
            created_by CHAR(36) NULL,
            updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
            updated_by CHAR(36) NULL,
            deleted_at TIMESTAMP NULL,
            deleted_by CHAR(36) NULL
          );`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE sppd_jenis_transportasi`);
    }

}
