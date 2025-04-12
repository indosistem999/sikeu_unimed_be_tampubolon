import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTahunAnggaranTable1744389451161 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE master_budget_year (
            budget_id CHAR(36) PRIMARY KEY,
            budget_name VARCHAR(255) DEFAULT NULL,
            budget_start_date DATE DEFAULT NULL,
            budget_end_date DATE DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            created_by CHAR(36) NULL,
            updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
            updated_by CHAR(36) NULL,
            deleted_at TIMESTAMP NULL,
            deleted_by CHAR(36) NULL
          );`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE master_budget_year`);
    }


}
