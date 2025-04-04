export const identitySchema: {
  tableName: string,
  primaryKey: string,
} = {
  tableName: 'master_identity',
  primaryKey: 'identity_id'
}

export const sortRequest: Record<string, any> = {
  name: 'name',
  phone: 'phone',
  email: 'email'
};

export const sortDefault: string[] = [`name`, 'asc'];