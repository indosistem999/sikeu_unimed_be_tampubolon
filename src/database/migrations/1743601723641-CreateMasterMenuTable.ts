import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMasterMenuTable1743601723641 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE master_menu (
      menu_id CHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      icon LONGTEXT DEFAULT NULL,  
      slug LONGTEXT DEFAULT NULL,
      order_number BIGINT DEFAULT NULL,  
      parent_id CHAR(36) NULL,
      module_id CHAR(36),  
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      created_by CHAR(36) NULL,
      updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
      updated_by CHAR(36) NULL,
      deleted_at TIMESTAMP NULL,
      deleted_by CHAR(36) NULL,
      CONSTRAINT fk_menu_parent_id FOREIGN KEY (parent_id) REFERENCES master_menu(menu_id) ON DELETE SET NULL,
      CONSTRAINT fk_module_id FOREIGN KEY (module_id) REFERENCES master_module(module_id) ON DELETE SET NULL
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE master_menu`);
  }
}
