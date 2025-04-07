import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWorkUnitTable1743995601982 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE master_work_unit (
          unit_id CHAR(36) PRIMARY KEY,
          unit_code VARCHAR(255) NOT NULL,
          unit_type VARCHAR(255) NULL DEFAULT NULL,
          unit_name TEXT NULL DEFAULT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          created_by CHAR(36) NULL,
          updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
          updated_by CHAR(36) NULL,
          deleted_at TIMESTAMP NULL,
          deleted_by CHAR(36) NULL
        );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE master_work_unit`);
  }

}
