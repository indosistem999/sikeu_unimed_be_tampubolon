export const userSchema: {
    tableName: string,
    primaryKey: string,
} = {
    tableName: 'users',
    primaryKey: 'user_id',

}


export const sortRequest: Record<string, any> = {
    email: 'email',
    phone_number: 'phone_number',
    created_at: 'created_at',
    gender: 'gender',
    nip: 'nip',
    job_position: 'job_position',
    start_work_at: 'start_work_at',
    end_work_at: 'end_work_at'
};

export const sortDefault: string[] = [`created_at`, 'asc'];

