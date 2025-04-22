import { MigrationInterface, QueryRunner } from "typeorm";
import { ProcedureList } from "../../constanta";


export class CreateGetStatisticSPPDMonthlyYearProcedur1745231064337 implements MigrationInterface {

    public procedureName: string = ProcedureList.SppdBeranda.ChartMonthly

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP PROCEDURE IF EXISTS  ${this.procedureName};
        `);

        await queryRunner.query(`
        CREATE PROCEDURE ${this.procedureName} (
            IN start_year INT,
            IN end_year INT,
            IN id_unit CHAR(36)
        )
        BEGIN
            WITH RECURSIVE bulan(bulan_num) AS (
                SELECT 1
                UNION ALL
                SELECT bulan_num + 1 FROM bulan WHERE bulan_num < 12
            ),
            tahun_data AS (
                SELECT DISTINCT YEAR(tanggal_surat) AS tahun 
                FROM sppd_surat_tugas
            ),
            semua_bulan_tahun AS (
                SELECT t.tahun, b.bulan_num
                FROM tahun_data t
                CROSS JOIN bulan b
            ),
            data_asli AS (
                SELECT
                    YEAR(tanggal_surat) AS tahun,
                    MONTH(tanggal_surat) AS bulan,
                    COUNT(*) AS jumlah
                FROM sppd_surat_tugas
                GROUP BY YEAR(tanggal_surat), MONTH(tanggal_surat)
            ),
            gabungan AS (
                SELECT
                    sbt.tahun,
                    sbt.bulan_num,
                    COALESCE(da.jumlah, 0) AS jumlah
                FROM semua_bulan_tahun sbt
                LEFT JOIN data_asli da
                    ON sbt.tahun = da.tahun AND sbt.bulan_num = da.bulan
            ),
            bulan_bernama AS (
                SELECT
                    tahun,
                    bulan_num,
                    CASE bulan_num
                        WHEN 1 THEN 'Jan'
                        WHEN 2 THEN 'Feb'
                        WHEN 3 THEN 'Mar'
                        WHEN 4 THEN 'Apr'
                        WHEN 5 THEN 'Mei'
                        WHEN 6 THEN 'Jun'
                        WHEN 7 THEN 'Jul'
                        WHEN 8 THEN 'Aug'
                        WHEN 9 THEN 'Sep'
                        WHEN 10 THEN 'Oct'
                        WHEN 11 THEN 'Nov'
                        WHEN 12 THEN 'Dec'
                    END AS bulan_nama,
                    jumlah
                FROM gabungan
            )
            
            SELECT 
                tahun as year_number,
                JSON_OBJECTAGG(bulan_nama, jumlah) AS list_month
            FROM (
                SELECT * FROM bulan_bernama 
                WHERE tahun BETWEEN start_year AND end_year
                ORDER BY tahun, bulan_num
            ) AS ordered_bulan
            GROUP BY tahun;
        END;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP PROCEDURE IF EXISTS ${this.procedureName};`);
    }

}
