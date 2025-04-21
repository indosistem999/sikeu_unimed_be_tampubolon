import AppDataSource from '../../config/dbconfig';
import { publishMessage } from '../../config/rabbitmq';
import { QueueList, ExchangeList } from '../../constanta'
import { Users } from '../../database/models/Users';



export const eventPublishNotification = async (
    data: Record<string, any>
): Promise<void> => {

    await publishMessage(ExchangeList.Notification, QueueList.Notification, data)
}