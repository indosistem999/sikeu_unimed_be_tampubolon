import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSPDEmployeeTable1744336380190 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE sppd_pegawai (
          pegawai_id CHAR(36) PRIMARY KEY,
          nik VARCHAR(255) UNIQUE,
          nip VARCHAR(255) UNIQUE,
          nama VARCHAR(255) NOT NULL,
          username VARCHAR(255) NOT NULL,
          gelar_depan VARCHAR(100) DEFAULT NULL,
          email VARCHAR(255) DEFAULT NULL,
          phone VARCHAR(50) DEFAULT NULL,
          pangkat_id CHAR(36) DEFAULT NULL,
          unit_id CHAR(36) DEFAULT NULL,
          jenis_kepegawaian VARCHAR(150) DEFAULT NULL,
          status_kepegawaian VARCHAR(150) DEFAULT NULL,
          status_active TINYINT(1) DEFAULT FALSE,
          simpeg_id VARCHAR(255) DEFAULT NULL,
          photo TEXT NULL DEFAULT NULL,
          synchronize_date TIMESTAMP NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          created_by CHAR(36) NULL,
          updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
          updated_by CHAR(36) NULL,
          deleted_at TIMESTAMP NULL,
          deleted_by CHAR(36) NULL,
          CONSTRAINT fk_pegawai_pangkat_id FOREIGN KEY (pangkat_id) REFERENCES sppd_pangkat_golongan(pangkat_id) ON DELETE SET NULL,
          CONSTRAINT fk_pegawai_unit_id FOREIGN KEY (unit_id) REFERENCES master_work_unit(unit_id) ON DELETE SET NULL
        );`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE sppd_pegawai`);
    }

}
