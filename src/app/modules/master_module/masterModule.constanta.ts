export const propSchema: {
    tableName: string,
    primaryKey: string,
    alias: string
} = {
    tableName: 'master_module',
    primaryKey: 'module_id',
    alias: 'module'
}

export const sortRequest: Record<string, any> = {
    order_number: `order_number`,
    module_name: `module_name`,
    module_path: `module_path`,
    created_at: `created_at`
};


export const sortDefault: string[] = [`created_at`, 'asc'];