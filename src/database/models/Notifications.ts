import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Users } from "./Users";
import { RoleModuleAssociation } from "./RoleModuleAssociation";

@Entity({ name: 'notifications' })
export class Notifications {
    @PrimaryGeneratedColumn('uuid')
    notification_id!: string;

    @Column({ name: 'sender_id', type: 'uuid', default: null, nullable: true })
    sender_id!: string

    @Column({ name: 'receiver_id', type: 'uuid', default: null, nullable: true })
    receiver_id!: string


    @Column({ type: 'varchar', length: 255, name: 'topic', default: null })
    topic!: string;

    @Column({ type: 'longtext', name: 'message', default: null })
    message!: string;


    @Column({ type: 'tinyint', name: 'is_read', default: 0 })
    is_read!: number;

    @Column({ type: 'longtext', name: 'metadata', default: null })
    metadata!: string;

    @Column({ type: 'varchar', length: 255, name: 'type_notif', default: null })
    type_notif!: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    created_at!: Date;

    @Column({ name: 'created_by', type: 'uuid', select: false })
    created_by!: string;

    @UpdateDateColumn({ type: 'timestamp', nullable: true, name: 'updated_at' })
    updated_at!: Date;

    @Column({ name: 'updated_by', type: 'uuid', select: false })
    updated_by!: string;

    @DeleteDateColumn({ type: 'timestamp', nullable: true, name: 'deleted_at', select: false })
    deleted_at!: Date;

    @Column({ name: 'deleted_by', type: 'uuid', select: false })
    deleted_by!: string;


    @OneToOne(() => Users, (value) => value.senders)
    @JoinColumn({ name: 'sender_id' })
    user_sender!: Users;

    @OneToOne(() => Users, (value) => value.receivers)
    @JoinColumn({ name: 'receiver_id' })
    user_receiver!: Users;
}
