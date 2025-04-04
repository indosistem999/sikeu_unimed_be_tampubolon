import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRolesTable1743601665298 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE roles (
        role_id CHAR(36) PRIMARY KEY,
        role_name VARCHAR(255) NOT NULL,
        role_slug VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        created_by CHAR(36) NULL,
        updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
        updated_by CHAR(36) NULL,
        deleted_at TIMESTAMP NULL,
        deleted_by CHAR(36) NULL
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE roles`);
  }
}
