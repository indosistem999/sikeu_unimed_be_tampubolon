export const userSchema: {
    tableName: string,
    primaryKey: string,
} = {
    tableName: 'users',
    primaryKey: 'user_id'
}

export const sortRequest: Record<string, any> = {
    unit_code: 'unit_code',
    unit_type: 'unit_type',
    unit_name: 'unit_name'
};

export const sortDefault: string[] = [`unit_code`, 'asc'];

