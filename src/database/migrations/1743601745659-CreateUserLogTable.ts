import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserLogTable1743601745659 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE user_log (
          log_id CHAR(36) PRIMARY KEY,
          user_id CHAR(36) NOT NULL,
          activity_type TEXT DEFAULT NULL,
          activity_time TIMESTAMP DEFAULT NULL,
          description LONGTEXT DEFAULT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updated_at TIMESTAMP DEFAULT NULL,
          deleted_at TIMESTAMP DEFAULT NULL,
          created_by CHAR(36) DEFAULT NULL,
          updated_by CHAR(36) DEFAULT NULL,
          deleted_by CHAR(36) DEFAULT NULL,
          CONSTRAINT fk_log_user_id FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE user_log`);
  }
}
