import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddWorkUnitToUser1743996348863 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("users", new TableColumn({
            name: "has_work_unit",  // Name of the new column
            type: "tinyint",   // Data type for TINYINT
            width: 1,          // Optional, display width (this doesn't affect storage size)
            isNullable: false, // Set to false if this column should not allow null values
            default: 0,
        }));

        await queryRunner.addColumn("users", new TableColumn({
            name: "unit_id",
            type: "char",
            width: 36,  // You can change this type depending on your needs (e.g., 'int', 'text', etc.)
            isNullable: true,  // Set to false if this column should not allow null values
            default: null
        }));


    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("users", "has_unit");
        await queryRunner.dropColumn("users", "unit_id");
    }

}
