
import { Request } from 'express'
import { publishMessage } from '../../config/rabbitmq'
import { ExchangeList, QueueList } from '../../constanta'
import { getRequestSecure } from '../../lib/utils/request.util'
export const snapLogActivity = async (
    req: Request,
    userId: string,
    activityType: string,
    description: string,
    activityTime: Date,
    oldData: Record<string, any> | null = null,
    updateData: Record<string, any> | null = null
): Promise<void> => {
    let data: Record<string, any> = {}

    if (oldData != null || updateData != null) {
        data = {
            user_id: userId,
            activity_time: activityTime,
            activity_type: activityType,
            description,
            snapcut: JSON.stringify({
                before: oldData,
                after: updateData
            }),
            requset_properties: getRequestSecure(req)
        }
    }
    else {
        data = {
            user_id: userId,
            activity_time: activityTime,
            activity_type: activityType,
            description,
            requset_properties: getRequestSecure(req)
        }
    }


    await publishMessage(ExchangeList.LogActivity, QueueList.LogActivity, data)
}
