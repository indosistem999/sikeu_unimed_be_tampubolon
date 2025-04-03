import {subscribeMessage} from '../../config/rabbitmq';
import {QueueList, ExchangeList} from '../../constanta'

const goSendToEmail = (exchangeName: string, queueName: string, message: string) => {
    console.log(`I have get message that`, {exchangeName, queueName, message})
}

export const eventSubscribeMessageToSendEmail = async(): Promise<void> => {
    const queue: string = QueueList.Email;
    const exchange: string = ExchangeList.Email
    
    console.info(`System checking exchange and queue (${exchange}, ${queue}) response from broker`)
    try {
        await subscribeMessage(exchange, queue, goSendToEmail)
    } catch (err: any) {
        console.info(`Error response checking exchange and queue (${exchange}, ${queue}) : `, err)
    }
    
    
}