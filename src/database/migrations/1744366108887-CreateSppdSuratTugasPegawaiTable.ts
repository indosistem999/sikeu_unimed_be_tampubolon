import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateSppdSuratTugasPegawaiTable1744366108887 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "sppd_surat_tugas_pegawai",
                columns: [
                    {
                        name: "assign_surat_id",
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
                        name: "pegawai_id",
                        type: "char",
                        length: "36",
                        isNullable: true,
                    },
                    {
                        name: "jabatan_kegiatan",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "tanggal_pergi",
                        type: "date",
                        isNullable: true,
                    },
                    {
                        name: "tanggal_pulang",
                        type: "date",
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
            "sppd_surat_tugas_pegawai",
            new TableForeignKey({
                columnNames: ["surat_tugas_id"],
                referencedColumnNames: ["surat_tugas_id"],
                referencedTableName: "sppd_surat_tugas",
                onDelete: "SET NULL",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("sppd_surat_tugas_pegawai");
        const foreignKey = table?.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("surat_tugas_id") !== -1
        );
        if (foreignKey) {
            await queryRunner.dropForeignKey("sppd_surat_tugas_pegawai", foreignKey);
        }
        await queryRunner.dropTable("sppd_surat_tugas_pegawai");
    }
} 