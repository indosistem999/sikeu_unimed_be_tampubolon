import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterColumnOnTableUser1745207481851 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE users
            MODIFY COLUMN start_work_at TIME NULL DEFAULT NULL
        `);


        await queryRunner.query(`
            ALTER TABLE users
            MODIFY COLUMN end_work_at TIME NULL DEFAULT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE users
            MODIFY COLUMN start_work_at TIMESTAMP NULL DEFAULT NULL
        `);

        await queryRunner.query(`
            ALTER TABLE users
            MODIFY COLUMN end_work_at TIMESTAMP NULL DEFAULT NULL
        `);

    }
}
