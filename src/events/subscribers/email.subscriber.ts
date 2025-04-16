import { execEmailSender } from '../../config/mailers';
import { subscribeMessage } from '../../config/rabbitmq';
import { QueueList, ExchangeList } from '../../constanta'

const goSendToEmail = async (exchangeName: string, queueName: string, message: string): Promise<void> => {
    const payload = JSON.parse(message);

    await execEmailSender({
        sender: payload.customer_email,
        receiver: payload.user.email,
        subject: payload.subject,
        cc: payload.cc,
        attachments: [],
        template: payload.template,
        data: payload
    })


    console.log(`I have get message that`, { exchangeName, queueName, message })
}

export const eventSubscribeMessageToSendEmail = async (): Promise<void> => {
    const queue: string = QueueList.Email;
    const exchange: string = ExchangeList.Email

    console.info(`Now System checking exchange and queue (${exchange}, ${queue}) response from broker`)
    try {
        await subscribeMessage(exchange, queue, goSendToEmail)
    } catch (err: any) {
        console.info(`Error response checking exchange and queue (${exchange}, ${queue}) : `, err)
    }

}