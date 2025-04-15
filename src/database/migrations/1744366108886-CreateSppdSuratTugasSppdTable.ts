import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateSppdSuratTugasSppdTable1744366108886 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "sppd_surat_tugas_sppd",
                columns: [
                    {
                        name: "sppd_id",
                        type: "char",
                        length: "36",
                        isPrimary: true,
                        isNullable: false,
                    },
                    {
                        name: "surat_tugas_id",
                        type: "char",
                        length: "36",
                        isNullable: true,
                    },
                    {
                        name: "bagian_surat_id",
                        type: "char",
                        length: "36",
                        isNullable: true,
                    },
                    {
                        name: "tanggal_sppd",
                        type: "date",
                        isNullable: true,
                    },
                    {
                        name: "instansi",
                        type: "varchar",
                        length: "200",
                        isNullable: true,
                    },
                    {
                        name: "akun",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "lainnya",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "officers_id",
                        type: "char",
                        length: "36",
                        isNullable: true,
                    },
                    {
                        name: "transportation_type_id",
                        type: "char",
                        length: "36",
                        isNullable: true,
                    },
                    {
                        name: "lokasi_awal",
                        type: "varchar",
                        length: "200",
                        isNullable: true,
                    },
                    {
                        name: "lokasi_akhir",
                        type: "varchar",
                        length: "200",
                        isNullable: true,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        isNullable: false,
                    },
                    {
                        name: "created_by",
                        type: "char",
                        length: "36",
                        isNullable: true,
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        isNullable: true,
                    },
                    {
                        name: "updated_by",
                        type: "char",
                        length: "36",
                        isNullable: true,
                    },
                    {
                        name: "deleted_at",
                        type: "timestamp",
                        isNullable: true,
                    },
                    {
                        name: "deleted_by",
                        type: "char",
                        length: "36",
                        isNullable: true,
                    },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "sppd_surat_tugas_sppd",
            new TableForeignKey({
                columnNames: ["surat_tugas_id"],
                referencedColumnNames: ["surat_tugas_id"],
                referencedTableName: "sppd_surat_tugas",
                onDelete: "SET NULL",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("sppd_surat_tugas_sppd");
        const foreignKey = table?.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("surat_tugas_id") !== -1
        );
        if (foreignKey) {
            await queryRunner.dropForeignKey("sppd_surat_tugas_sppd", foreignKey);
        }
        await queryRunner.dropTable("sppd_surat_tugas_sppd");
    }
} 