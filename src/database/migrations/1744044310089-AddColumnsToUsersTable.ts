import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnsToUsersTable1744044310089 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("users", new TableColumn({
            name: "nip",
            type: "varchar",
            width: 50,
            isNullable: true,
            default: null
        }));

        await queryRunner.addColumn("users", new TableColumn({
            name: "job_position",
            type: "text",
            width: 50,
            isNullable: true,
            default: null
        }));

        await queryRunner.addColumn("users", new TableColumn({
            name: "start_work_at",
            type: "timestamp",
            isNullable: true,
            default: null
        }));

        await queryRunner.addColumn("users", new TableColumn({
            name: "end_work_at",
            type: "timestamp",
            isNullable: true,
            default: null
        }));


        await queryRunner.addColumn("users", new TableColumn({
            name: "has_determined",
            type: "tinyint",
            default: false
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("users", "nip");
        await queryRunner.dropColumn("users", "job_position");
        await queryRunner.dropColumn("users", "start_work_at");
        await queryRunner.dropColumn("users", "end_work_at");
        await queryRunner.dropColumn("users", "has_determined");
    }

}
