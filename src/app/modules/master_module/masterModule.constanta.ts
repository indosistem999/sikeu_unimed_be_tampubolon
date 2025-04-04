export const propSchema: {
    tableName: string,
    primaryKey: string,
} = {
    tableName: 'master_module',
    primaryKey: 'module_id'
}

export const sortRequest: Record<string, any> = {
    order_number: 'order_number',
    module_name: 'module_name',
    folder_name: 'folder_name'
};

export const sortDefault: string[] = [`order_number`, 'asc'];