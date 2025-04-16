import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMaterializedViewSppdBerandaTop1744794717837 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE mv_sppd_beranda_top (
                total_surat INT,
                total_pegawai INT,
                total_satker INT,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);

        await queryRunner.query(`
            CREATE PROCEDURE RefreshMaterializedViewSppdBerandaTop()
            BEGIN
                REPLACE INTO mv_sppd_beranda_top (total_surat, total_pegawai, total_satker)
                SELECT
                    (
                        SELECT COUNT(sst.surat_tugas_id) FROM sppd_surat_tugas sst 
                        WHERE sst.deleted_at IS NULL 
                            AND YEAR(sst.tanggal_surat) = YEAR(CURRENT_DATE()) 
                            AND MONTH(sst.tanggal_surat) = MONTH(CURRENT_DATE())
                    ) AS total_surat,
                    (
                        SELECT COUNT(sp.pegawai_id) FROM sppd_pegawai sp 
                        WHERE sp.deleted_at IS NULL
                    ) AS total_pegawai,
                    (
                        SELECT COUNT(mu.unit_id) FROM master_work_unit mu 
                        WHERE mu.deleted_at IS NULL
                    ) AS total_satker;
            END;
        `);

        await queryRunner.query(`
            CREATE EVENT refresh_mv_sppd_beranda_top
            ON SCHEDULE EVERY 1 HOUR
            DO CALL RefreshMaterializedViewSppdBerandaTop();
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP EVENT IF EXISTS refresh_mv_sppd_beranda_top;`);
        await queryRunner.query(`DROP PROCEDURE IF EXISTS RefreshMaterializedViewSppdBerandaTop;`);
        await queryRunner.query(`DROP TABLE IF EXISTS mv_sppd_beranda_top;`);
    }

}
