import AppDataSource from "../../config/dbconfig";
import { Logger } from "../../config/logger";
import { subscribeMessage } from "../../config/rabbitmq";
import { ExchangeList, QueueList } from "../../constanta";
import { Notifications } from "../../database/models/Notifications";

const createNotification = async (exchangeName: string, queueName: string, message: string): Promise<void> => {

    if (message && message != null && message != '') {
        const objectData = JSON.parse(message);

        if (objectData?.row_data?.length > 0) {
            const queryRunner = AppDataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
                await AppDataSource.getRepository(Notifications).insert(objectData?.row_data)
                await queryRunner.commitTransaction();
            } catch (error: any) {
                await queryRunner.rollbackTransaction();
                Logger().error(`Error store notification`, error);
            } finally {
                await queryRunner.release();
            }
        }
    }
    else {
        Logger().error(
            `Empty message from exchange ${exchangeName}, queue '${queueName}'`
        );
    }
}

export const eventSubscribeNotification = async (): Promise<void> => {
    const queue: string = QueueList.Notification;
    const exchange: string = ExchangeList.Notification

    console.info(`Now System checking exchange and queue (${exchange}, ${queue}) response from broker`)

    try {
        await subscribeMessage(exchange, queue, createNotification)
    } catch (err: any) {
        console.info(`Error response checking exchange and queue (${exchange}, ${queue}) : `, err)
    }
}