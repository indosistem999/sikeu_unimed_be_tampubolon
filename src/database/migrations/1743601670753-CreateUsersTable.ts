import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1743601670753 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE users (
      user_id CHAR(36) PRIMARY KEY,
      role_id CHAR(36),
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE,
      password VARCHAR(255) NOT NULL,
      salt TEXT,
      remember_token VARCHAR(255),
      reset_token VARCHAR(255),
      security_question_id VARCHAR(255),
      security_question_answer VARCHAR(255),
      last_ip VARCHAR(255),
      last_hostname VARCHAR(255),
      last_login TIMESTAMP NULL,
      registered_date TIMESTAMP NULL,
      email_verification_token VARCHAR(255),
      email_verification_token_expired TIMESTAMP NULL,
      reset_token_expired TIMESTAMP NULL,
      photo TEXT,
      phone_number VARCHAR(20),
      is_active TINYINT(1) DEFAULT 0,
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
