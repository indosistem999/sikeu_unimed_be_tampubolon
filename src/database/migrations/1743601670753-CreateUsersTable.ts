import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1743601670753 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE users (
      user_id CHAR(36) PRIMARY KEY,
      role_id CHAR(36),
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE,
      password LONGTEXT NOT NULL,
      salt LONGTEXT NULL DEFAULT NULL,
      refresh_token LONGTEXT NULL,
      photo TEXT NULL DEFAULT NULL,
      phone_number VARCHAR(20) NULL DEFAULT NULL,
      email_verification_token VARCHAR(255),
      email_verification_token_expired TIMESTAMP NULL,
      reset_token_code TEXT NULL DEFAULT NULL,
      reset_token_expired TIMESTAMP NULL,
      is_active TINYINT(1) DEFAULT 0,
      security_question_id VARCHAR(255) DEFAULT NULL,
      security_question_answer VARCHAR(255) DEFAULT NULL,
      last_ip VARCHAR(255) DEFAULT NULL,
      last_hostname VARCHAR(255) DEFAULT NULL,
      last_login TIMESTAMP NULL,
      registered_date TIMESTAMP NULL,
      verified_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP NULL,
      created_by CHAR(36),
      updated_by CHAR(36),
      deleted_by CHAR(36),
      CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE SET NULL
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE users`);
  }
}
