import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEnvironmentAppTable1743601813781 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE environment_app (
      env_id CHAR(36) PRIMARY KEY,
      code VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      logo TEXT NULL,  
      phone_number VARCHAR(20) NULL, 
      email VARCHAR(255) NULL,  
      address LONGTEXT NULL, 
      website VARCHAR(255) NULL,  
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      created_by CHAR(36) NULL,
      updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
      updated_by CHAR(36) NULL,
      deleted_at TIMESTAMP NULL,
      deleted_by CHAR(36) NULL
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE environment_app`);
  }
}
