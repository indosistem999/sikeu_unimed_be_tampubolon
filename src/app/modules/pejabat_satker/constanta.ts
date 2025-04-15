export const sortRequestUnitWork: Record<string, any> = {
    unit_code: 'mwu.unit_code',
    unit_name: 'mwu.unit_name',
    unit_type: 'mwu.unit_type',
    total_officers: `count(mo.officers_id)`,
    created_at: 'mwu.created_at'
};

export const sortDefaultUnitWork: string[] = [`mwu.created_at`, 'asc'];


export const sortRequestOfficer: Record<string, any> = {
    nip: 'nip',
    full_name: 'full_name',
    posititon_name: 'posititon_name',
    start_date_position: 'start_date_position',
    end_date_position: 'end_date_position',
    created_at: 'created_at'
};

export const sortDefaultOfficer: string[] = [`created_at`, 'asc'];

