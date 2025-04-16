import AppDataSource from "../../config/dbconfig";
import { subscribeMessage } from "../../config/rabbitmq";
import { ExchangeList, QueueList } from "../../constanta";
import { UserLog } from "../../database/models/UserLog";

const storeLogUser = async (exchangeName: string, queueName: string, message: string): Promise<void> => {
    const repository = AppDataSource.getRepository(UserLog)
    const payload = JSON.parse(message)
    try {

        const { ip_address, agent } = payload.requset_properties

        const result = await repository.save(repository.create({
            user_id: payload.user_id,
            activity_time: payload.activity_time,
            activity_type: payload.activity_type,
            description: payload.description,
            ip_address,
            browser_name: agent.browser_name,
            snapcut: payload.snapcut,
            request_properties: JSON.stringify(payload.requset_properties),
            created_at: payload.activity_time,
            created_by: payload.user_id
        }))

        if (!result) {
            console.error(`Error store log activity to table user log`, result)
        }

        console.info(`Store data log activity successfully. Log Id ${result.log_id}`)

    } catch (error: any) {
        console.error(`Error store log activity to table user log`, error)
    }
}



export const eventSubscribeMessageToStoreLogUser = async (): Promise<void> => {
    const queue: string = QueueList.LogActivity;
    const exchange: string = ExchangeList.LogActivity

    console.info(`Now System checking exchange and queue (${exchange}, ${queue}) response from broker`)

    try {
        await subscribeMessage(exchange, queue, storeLogUser)
    } catch (err: any) {
        console.info(`Error response checking exchange and queue (${exchange}, ${queue}) : `, err)
    }
}