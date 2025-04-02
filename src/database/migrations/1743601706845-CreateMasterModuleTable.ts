import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMasterModuleTable1743601706845 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE master_module (
      module_id CHAR(36) PRIMARY KEY,
      module_name VARCHAR(255) NOT NULL,
      folder_name VARCHAR(255) NULL,
      icon LONGTEXT NULL, 
      logo LONGTEXT NULL, 
      order_number BIGINT DEFAULT NULL,  -- Fixed missing comma
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP NULL,
      created_by CHAR(36),
      updated_by CHAR(36),
      deleted_by CHAR(36)
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE master_module`);
  }
}
