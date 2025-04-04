import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateModuleMenuAssociationTable1743601794771 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE module_menu_association (
      menu_access_id CHAR(36) PRIMARY KEY,
      module_access_id CHAR(36),
      access_name VARCHAR(255),  
      access_status TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      created_by CHAR(36) NULL,
      updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
      updated_by CHAR(36) NULL,
      deleted_at TIMESTAMP NULL,
      deleted_by CHAR(36) NULL,
      CONSTRAINT fk_association_module_access_id FOREIGN KEY (module_access_id) 
          REFERENCES role_module_association(module_access_id) ON DELETE SET NULL
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE module_menu_association`);
  }
}
