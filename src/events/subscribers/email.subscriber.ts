import {rabbitMqConfig} from '../../config/rabbitmq';
import {QueueList, ExchangeList} from '../../constanta'

const goSendToEmail = (exchangeName: string, queueName: string, message: string) => {
    console.log(`I have get message that`, {exchangeName, queueName, message})
}

export const eventSubscribeMessageToSendEmail = async(): Promise<void> => {
    const queue: string = QueueList.Email;
    const exchange: string = ExchangeList.Email
    await rabbitMqConfig.subscribeMessage(exchange, queue, goSendToEmail)
}