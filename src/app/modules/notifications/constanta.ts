export const selectNotifColumns: Record<string, any> = {
    notification_id: true,
    topic: true,
    message: true,
    is_read: true,
    user_receiver: {
        user_id: true,
        first_name: true,
        last_name: true,
    },
    user_sender: {
        user_id: true,
        first_name: true,
        last_name: true,
    },
    metadata: true,
    type_notif: true,
    created_at: true,
    updated_at: true
}