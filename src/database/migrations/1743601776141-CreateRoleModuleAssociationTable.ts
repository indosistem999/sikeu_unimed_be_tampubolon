import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoleModuleAssociationTable1743601776141 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE role_module_association (
          module_access_id CHAR(36) PRIMARY KEY,
          role_id CHAR(36) NOT NULL,
          module_id CHAR(36) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          created_by CHAR(36) NULL,
          updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
          updated_by CHAR(36) NULL,
          deleted_at TIMESTAMP NULL,
          deleted_by CHAR(36) NULL,
          CONSTRAINT fk_association_role_id FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE,
          CONSTRAINT fk_association_module_id FOREIGN KEY (module_id) REFERENCES master_module(module_id) ON DELETE CASCADE
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE role_module_association`);
  }
}
