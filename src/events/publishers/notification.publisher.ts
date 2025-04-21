import { In, IsNull } from 'typeorm';
import AppDataSource from '../../config/dbconfig';
import { publishMessage } from '../../config/rabbitmq';
import { QueueList, ExchangeList } from '../../constanta'
import { Users } from '../../database/models/Users';
import { I_AuthUserPayload } from '../../interfaces/auth.interface';



export const eventPublishNotification = async (
    reqUsers: Record<string, any> | I_AuthUserPayload | any,
    topic: string,
    message: string,
    typeNotif: string,
    createdAt: Date,
    meta: Record<string, any> | null = null
): Promise<void> => {

    const roleSlug = reqUsers?.role?.role_slug
    const sender_id: string = reqUsers?.user_id;
    const metaData = meta != null ? JSON.stringify(meta) : meta;
    const createdBy = reqUsers?.user_id
    let rowInserts: Record<string, any>[] = []

    if (['admin', 'developer'].includes(roleSlug)) {
        const users = await AppDataSource.getRepository(Users).find({
            where: { deleted_at: IsNull() }
        });

        if (users) {
            rowInserts = users.map((u: any) => {
                return {
                    sender_id,
                    receiver_id: u.user_id,
                    topic,
                    message,
                    is_read: 0,
                    metadata: metaData,
                    type_notif: typeNotif,
                    created_at: createdAt,
                    created_by: createdBy
                }
            });
        }
    }
    else {
        const users = await AppDataSource.getRepository(Users).find({
            where: {
                deleted_at: IsNull(),
                role: {
                    role_slug: In(['admin', 'developer'])
                }
            },
        });

        if (users) {
            rowInserts = users.map((u: any) => {
                return {
                    sender_id,
                    receiver_id: u.user_id,
                    topic,
                    message,
                    is_read: 0,
                    metadata: metaData,
                    type_notif: typeNotif,
                    created_at: createdAt,
                    created_by: createdBy
                }
            });
        }
    }

    const data: Record<string, any> = { row_data: rowInserts }
    await publishMessage(ExchangeList.Notification, QueueList.Notification, data)
}