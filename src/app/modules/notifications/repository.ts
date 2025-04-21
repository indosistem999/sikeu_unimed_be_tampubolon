import { Equal, IsNull, Like, MoreThanOrEqual } from "typeorm";
import AppDataSource from "../../../config/dbconfig";
import { I_RequestCustom, I_ResultService } from "../../../interfaces/app.interface";
import { MessageDialog } from "../../../lang";
import { Notifications } from "../../../database/models/Notifications";
import { selectNotifColumns } from "./constanta";


export class NotificationRepository {
    private repository = AppDataSource.getRepository(Notifications);

    setupErrorMessage(error: any): I_ResultService {
        return {
            success: false,
            message: error.message,
            record: error
        }
    }

    async fetch(req: I_RequestCustom, filters: Record<string, any>): Promise<I_ResultService> {
        try {
            const whereQuery: Record<string, any> = {
                deleted_at: IsNull(),
                receiver_id: req?.user?.user_id,
                is_read: 0,
            }

            const options: Record<string, any> = {
                where: whereQuery,
                relations: {
                    user_receiver: true,
                    user_sender: true,
                },
                select: selectNotifColumns,
                order: {
                    created_at: 'DESC'
                },
                skip: 0,
                take: 5
            }

            if (filters?.view_more == true) {
                const ninetyDaysAgo = new Date();
                ninetyDaysAgo.setDate(new Date().getDate() - 90);
                options.where.created_at = MoreThanOrEqual(ninetyDaysAgo);
                delete options.skip;
                delete options.take;
            }


            let result = await this.repository.find(options)

            return {
                success: true,
                message: MessageDialog.__('success.notifications.fetch'),
                record: result
            }
        } catch (error: any) {
            return this.setupErrorMessage(error)
        }
    }

    async fetchById(id: string): Promise<I_ResultService> {
        try {

            let result = await this.repository.findOne({
                where: {
                    deleted_at: IsNull(),
                    notification_id: id
                },
                relations: {
                    user_receiver: true,
                    user_sender: true,
                },
                select: selectNotifColumns,
            })

            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.default.notFoundItem', { item: 'Notification' }),
                    record: result
                }
            }

            result.metadata = result?.metadata ? JSON.parse(result.metadata) : result.metadata

            return {
                success: true,
                message: MessageDialog.__('success.notifications.fetch'),
                record: result
            }
        } catch (error: any) {
            return this.setupErrorMessage(error);
        }
    }

    async setRead(data: Record<string, any>): Promise<I_ResultService> {
        const { updated_at, updated_by, ...payload } = data
        try {
            const notificationId = payload.list_notification.map((x: any) => x.notification_id);
            const result = await this.repository.createQueryBuilder()
                .update()
                .where('deleted_at is null')
                .andWhere('notification_id IN (:...arrayId)', { arrayId: notificationId })
                .set({
                    is_read: 1,
                    updated_at,
                    updated_by
                })
                .execute();

            console.log({ result })


            if (!result) {
                return {
                    success: false,
                    message: MessageDialog.__('error.notifications.read'),
                    record: result
                }
            }

            return {
                success: true,
                message: MessageDialog.__('success.sppdPangkat.store'),
                record: result
            }
        } catch (err: any) {
            return this.setupErrorMessage(err)
        }
    }
}