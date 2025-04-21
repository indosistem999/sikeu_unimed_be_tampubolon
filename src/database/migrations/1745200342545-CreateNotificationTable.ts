import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNotificationTable1745200342545 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE notifications (
            notification_id CHAR(36) PRIMARY KEY,
            sender_id CHAR(36) DEFAULT NULL,
            receiver_id CHAR(36) DEFAULT NULL,
            topic VARCHAR(255) DEFAULT NULL,
            message LONGTEXT DEFAULT NULL,
            is_read TINYINT(1) DEFAULT 0,
            metadata LONGTEXT DEFAULT NULL,
            type_notif VARCHAR(255) DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            created_by CHAR(36) NULL,
            updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
            updated_by CHAR(36) NULL,
            deleted_at TIMESTAMP NULL,
            deleted_by CHAR(36) NULL,
            CONSTRAINT fk_notif_sender_id FOREIGN KEY (sender_id) 
                REFERENCES users(user_id) ON DELETE SET NULL,
            CONSTRAINT fk_notif_receiver_id FOREIGN KEY (receiver_id) 
                REFERENCES users(user_id) ON DELETE SET NULL  
        );`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE notifications`);
    }

}
