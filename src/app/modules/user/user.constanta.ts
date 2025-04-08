

export const sortDefault: string[] = ['created_at', 'DESC'];
export const sortRequest: Record<string, string> = {
    email: "user.email",
    phone_number: "user.phone_number",
    name: "concat(user.first_name, ' ' , user.last_name)",
    role_name: "role.role_name",
    unit_name: "work_unit.unit_name",
    created_at: "user.created_at"
};
