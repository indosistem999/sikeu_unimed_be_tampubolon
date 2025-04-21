import { Between, Equal, IsNull, Like, MoreThanOrEqual } from "typeorm";
import AppDataSource from "../../../config/dbconfig";
import { I_RequestCustom, I_ResultService } from "../../../interfaces/app.interface";
import { MessageDialog } from "../../../lang";
import { Notifications } from "../../../database/models/Notifications";
import { selectNotifColumns } from "./constanta";
import { getLastWeekRange, getRangeThisMonth, getRangeToday } from "../../../lib/utils/common.util";


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

            if (filters?.option) {
                switch (filters?.option?.toLowerCase()) {
                    case 'ninety_days':
                        const ninetyDaysAgo = new Date();
                        ninetyDaysAgo.setDate(new Date().getDate() - 90);
                        whereQuery.created_at = MoreThanOrEqual(ninetyDaysAgo);
                        break;

                    case 'one_month':
                        const rangeMonth = getRangeThisMonth();
                        whereQuery.created_at = Between(rangeMonth.startOfMonth, rangeMonth.endOfMonth);
                        break;

                    case 'one_week':
                        const lastWeek = getLastWeekRange();
                        whereQuery.created_at = Between(lastWeek.startOfLastWeek, lastWeek.startOfTomorrow)
                        break;

                    case 'choose_date':
                        if (filters?.start_date && filters?.end_date) {
                            whereQuery.created_at = Between(new Date(filters.start_date), new Date(filters.end_date))
                        } else if (filters?.start_date) {
                            whereQuery.created_at = MoreThanOrEqual(new Date(filters.start_date))
                        }

                        break;
                    default:
                        const rangeToday = getRangeToday();
                        whereQuery.created_at = Between(rangeToday.startOfToday, rangeToday.startOfTomorrow)
                        break;
                }
            }


            let result = await this.repository.find({
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
                take: filters?.limit
            })

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