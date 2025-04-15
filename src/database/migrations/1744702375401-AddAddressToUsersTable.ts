import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddAddressToUsersTable1744702375401 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("users", new TableColumn({
            name: "address",
            type: "text",
            isNullable: true,
            default: null
        }));

        await queryRunner.addColumn("users", new TableColumn({
            name: "password_change_at",
            type: "timestamp",
            isNullable: true,
            default: null
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("users", "address");
        await queryRunner.dropColumn("users", "password_change_at");
    }

}
