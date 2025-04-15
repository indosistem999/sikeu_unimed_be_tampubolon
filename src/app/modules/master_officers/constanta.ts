export const sortRequest: Record<string, any> = {
    nip: 'nip',
    posititon_name: 'posititon_name',
    full_name: 'full_name',
    position_type: 'position_type',
    created_at: 'created_at'
};

export const sortDefault: string[] = [`created_at`, 'asc'];


export const selectOfficer: Record<string, any> = {
    officers_id: true,
    full_name: true,
    nip: true,
    start_date_position: true,
    end_date_position: true,
    position_type: true,
    posititon_name: true,
    work_unit: true,
    job_category: true,
    created_at: true,
    updated_at: true
}