
import { publishMessage } from '../../config/rabbitmq'
import { ExchangeList, QueueList } from '../../constanta'
import { TagNameIntegration } from '../../lib/utils/global.util';


export const executeIntegration = async (
    payload: Record<string, any>[] | [] | any,
    moduleName: string = 'default'
): Promise<void> => {
    const data: Record<string, any> = {
        module_name: moduleName,
        row_data: payload
    }


    let exchange: string = '';
    let queue: string = ''

    switch (moduleName) {
        case TagNameIntegration.SppdPegawai.Import:
            exchange = ExchangeList.ImportFile.SppdPegawai
            queue = QueueList.ImportFile.SppdPegawai
            break;

        case TagNameIntegration.SppdPegawai.Sync:
            exchange = ExchangeList.SyncFile.SppdPegawai
            queue = QueueList.SyncFile.SppdPegawai
            break;

        default:
            exchange = ExchangeList.Default
            queue = QueueList.Default
            break;
    }

    await publishMessage(exchange, queue, data)
}

