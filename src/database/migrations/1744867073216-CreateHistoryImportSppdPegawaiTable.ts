import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHistoryImportSppdPegawaiTable1744867073216 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE history_import_pegawai (
          history_id CHAR(36) PRIMARY KEY,
          execute_time TIMESTAMP DEFAULT NULL,
          executor_id CHAR(36) DEFAULT NULL,
          description TEXT DEFAULT NULL,
          execute_status VARCHAR(255) DEFAULT NULL,
          execute_report LONGTEXT DEFAULT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          created_by CHAR(36) NULL,
          updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
          updated_by CHAR(36) NULL,
          deleted_at TIMESTAMP NULL,
          deleted_by CHAR(36) NULL,
          CONSTRAINT fk_history_import_executor_id FOREIGN KEY (executor_id) REFERENCES users(user_id) ON DELETE SET NULL  
        );`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE history_import_pegawai`);
    }

}
