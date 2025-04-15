
import { Request } from 'express'
import { publishMessage } from '../../config/rabbitmq'
import { ExchangeList, QueueList } from '../../constanta'
export const snapLogActivity = async (
    req: Request,
    userId: string,
    activityType: string,
    activityTime: Date,
    description: string,
    oldData: Record<string, any>,
    updateData: Record<string, any>
): Promise<Boolean> => {
    const data: Record<string, any> = {
        user_id: userId,
        activity_time: activityTime,
        activity_type: activityType,
        description,
        snap_cut: JSON.stringify({
            before: oldData,
            after: updateData
        }),
        requset_properties: req
    }

    await publishMessage(ExchangeList.LogActivity, QueueList.LogActivity, data)

    return true;
}
