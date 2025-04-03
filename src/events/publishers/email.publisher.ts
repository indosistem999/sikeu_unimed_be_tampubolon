import {publishMessage} from '../../config/rabbitmq';
import {QueueList, ExchangeList} from '../../constanta'
export const eventPublishMessageToSendEmail = async(data: Record<string, any>): Promise<void> => {
    await publishMessage(ExchangeList.Email, QueueList.Email, data)
}