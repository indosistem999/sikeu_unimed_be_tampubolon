import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserProfileTable1743996822221 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE user_profile (
              profile_id CHAR(36) PRIMARY KEY,
              user_id CHAR(36) DEFAULT NULL,
              nip VARCHAR(50) DEFAULT NULL,
              job_position TEXT DEFAULT NULL,
              start_work_at TIMESTAMP DEFAULT NULL,
              end_work_at TIMESTAMP DEFAULT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
              created_by CHAR(36) NULL,
              updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
              updated_by CHAR(36) NULL,
              deleted_at TIMESTAMP NULL,
              deleted_by CHAR(36) NULL,
              CONSTRAINT fk_profile_user_id FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
            )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE user_profile`);
    }

}
