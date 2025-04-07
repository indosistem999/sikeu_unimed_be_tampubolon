import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddGenderToUsersTable1744044146455 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.addColumn("users", new TableColumn({
            name: "gender",
            type: "varchar",
            width: 50,  // You can change this type depending on your needs (e.g., 'int', 'text', etc.)
            isNullable: true,  // Set to false if this column should not allow null values
            default: null
        }));


    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("users", "gender");
    }
}
