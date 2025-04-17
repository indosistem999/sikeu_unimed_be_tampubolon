import { Logger } from "../../config/logger";
import { eventSubscribeMessageToSendEmail } from "./email.subscriber";
import { eventSubscribeMessageToStoreLogUser } from "./logUser.subscriber";
import { eventSppdPegawaiImportIntegration } from "./sppdPegawai.subscriber";

export const RunSubscribers = async () => {
    try {
        console.info(`Start run all subscriber`)
        await eventSubscribeMessageToSendEmail();
        await eventSubscribeMessageToStoreLogUser();
        await eventSppdPegawaiImportIntegration()
    } catch (err: any) {
        console.info(`Opps... service run all subscriber error`, err)
        Logger().error(`Opps... service run all subscriber error`, err)
    }

}