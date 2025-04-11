import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSPDPangkatGolonganTable1744336380189 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE sppd_pangkat_golongan (
            pangkat_id CHAR(36) PRIMARY KEY,
            golongan_romawi TEXT DEFAULT NULL,
            golongan_angka VARCHAR(100) DEFAULT NULL,
            pangkat TEXT DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            created_by CHAR(36) NULL,
            updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
            updated_by CHAR(36) NULL,
            deleted_at TIMESTAMP NULL,
            deleted_by CHAR(36) NULL
          );`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE sppd_pangkat_golongan`);
    }

}
