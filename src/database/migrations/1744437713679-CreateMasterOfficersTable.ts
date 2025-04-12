import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMasterOfficersTable1744437713679 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE master_officers (
          officers_id CHAR(36) PRIMARY KEY,
          nip CHAR(36) UNIQUE,
          full_name VARCHAR(255) DEFAULT NULL,
          posititon_name VARCHAR(255) DEFAULT NULL,
          position_type ENUM('umum', 'satker') NOT NULL DEFAULT 'umum',
          job_category_id CHAR(36) DEFAULT NULL, 
          unit_id CHAR(36) DEFAULT NULL, 
          start_date_position DATE DEFAULT NULL,
          end_date_position DATE DEFAULT NULL,
          is_not_specified TINYINT(1) DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          created_by CHAR(36) NULL,
          updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
          updated_by CHAR(36) NULL,
          deleted_at TIMESTAMP NULL,
          deleted_by CHAR(36) NULL,
          CONSTRAINT fk_official_position_job_category_id FOREIGN KEY (job_category_id) REFERENCES master_job_category(job_category_id) ON DELETE SET NULL,
          CONSTRAINT fk_officer_unit_id_id FOREIGN KEY (unit_id) REFERENCES master_work_unit(unit_id) ON DELETE SET NULL
        );`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE master_officers`);
    }

}
