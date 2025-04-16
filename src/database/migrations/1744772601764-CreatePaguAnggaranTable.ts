import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePaguAnggaranTable1744772601764 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE pagu_anggaran (
          pagu_anggaran_id CHAR(36) PRIMARY KEY,
          output_id CHAR(36) DEFAULT NULL,
          component_id CHAR(36) DEFAULT NULL,
          mak_id CHAR(36) DEFAULT NULL,
          unit_id CHAR(36) DEFAULT NULL,
          sumber_dana_id CHAR(36) DEFAULT NULL,
          description LONGTEXT DEFAULT NULL,
          prices DECIMAL(10,2) DEFAULT NULL,
          realisasi DECIMAL(10,2) DEFAULT NULL,
          sisa_anggaran DECIMAL(10,2) DEFAULT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          created_by CHAR(36) NULL,
          updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
          updated_by CHAR(36) NULL,
          deleted_at TIMESTAMP NULL,
          deleted_by CHAR(36) NULL,
          CONSTRAINT fk_pagu_anggaran_output_id FOREIGN KEY (output_id) REFERENCES master_data_output(output_id) ON DELETE SET NULL,
          CONSTRAINT fk_pagu_anggaran_component_id FOREIGN KEY (component_id) REFERENCES master_data_component(component_id) ON DELETE SET NULL,
          CONSTRAINT fk_pagu_anggaran_mak_id FOREIGN KEY (mak_id) REFERENCES master_data_mak(mak_id) ON DELETE SET NULL,
          CONSTRAINT fk_pagu_anggaran_unit_id FOREIGN KEY (unit_id) REFERENCES master_work_unit(unit_id) ON DELETE SET NULL,
          CONSTRAINT fk_pagu_anggaran_sumber_dana_id(sumber_dana_id) REFERENCES master_sumber_dana(sumber_dana_id) ON DELETE SET NULL
        );`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE pagu_anggaran`);
    }

}
