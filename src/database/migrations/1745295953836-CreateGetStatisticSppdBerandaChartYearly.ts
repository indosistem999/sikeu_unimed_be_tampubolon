import { MigrationInterface, QueryRunner } from "typeorm";
import { ProcedureList } from "../../constanta";

export class CreateGetStatisticSppdBerandaChartYearly1745295953836 implements MigrationInterface {

    public procedureName: string = ProcedureList.SppdBeranda.ChartYearly

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP PROCEDURE IF EXISTS  ${this.procedureName};
        `);

        await queryRunner.query(`
            CREATE PROCEDURE ${this.procedureName} (
                IN start_year INT,
                IN end_year INT,
                IN unit CHAR(36)
            )
            BEGIN
                WITH RECURSIVE tahun_range AS (
                    SELECT start_year AS tahun
                    UNION ALL
                    SELECT tahun + 1 
                    FROM tahun_range 
                    WHERE tahun + 1 <= end_year
                ),
                data_surat AS (
                    SELECT 
                        YEAR(tanggal_surat) AS tahun,
                        COUNT(*) AS jumlah
                    FROM sppd_surat_tugas
                    WHERE 
                        deleted_at IS NULL AND
                        unit_id = unit AND
                        tanggal_surat IS NOT NULL AND
                        YEAR(tanggal_surat) BETWEEN start_year AND end_year
                    GROUP BY YEAR(tanggal_surat)
                )
                SELECT 
                    r.tahun as year_number,
                    COALESCE(d.jumlah, 0) as total
                FROM tahun_range r
                LEFT JOIN data_surat d ON r.tahun = d.tahun;
            END;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP PROCEDURE IF EXISTS ${this.procedureName};`);
    }

}
