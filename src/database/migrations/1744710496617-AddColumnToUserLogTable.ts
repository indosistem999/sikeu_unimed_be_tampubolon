import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnToUserLogTable1744710496617 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("user_log", new TableColumn({
            name: "ip_address",
            type: "text",
            isNullable: true,
            default: null
        }));

        await queryRunner.addColumn("user_log", new TableColumn({
            name: "browser_name",
            type: "text",
            isNullable: true,
            default: null
        }));

        await queryRunner.addColumn("user_log", new TableColumn({
            name: "snapcut",
            type: "longtext",
            isNullable: true,
            default: null
        }));


        await queryRunner.addColumn("user_log", new TableColumn({
            name: "request_properties",
            type: "longtext",
            isNullable: true,
            default: null
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("user_log", "ip_address");
        await queryRunner.dropColumn("user_log", "browser_name");
        await queryRunner.dropColumn("user_log", "request_properties");
        await queryRunner.dropColumn("user_log", "capture_activity");
    }
}
