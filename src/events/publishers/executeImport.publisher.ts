
import { publishMessage } from '../../config/rabbitmq'
import { ExchangeList, QueueList } from '../../constanta'


export const executeImported = async (
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
        case 'sppd-pegawai':
            exchange = ExchangeList.ImportFile.SppdPegawai
            queue = QueueList.ImportFile.SppdPegawai
            break;

        default:
            exchange = ExchangeList.ImportFile.Default
            queue = QueueList.ImportFile.Default
            break;
    }

    await publishMessage(exchange, queue, data)
}

