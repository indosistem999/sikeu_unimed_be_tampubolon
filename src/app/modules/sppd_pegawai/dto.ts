import { IsNotEmpty, IsOptional } from 'class-validator';
import { MessageDialog } from '../../../lang';

export class DTO_ValidationCreate {
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'NIK' }) })
    nik!: string;

    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'NIP' }) })
    nip!: string;


    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Name' }) })
    nama!: string;

    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Gelar' }) })
    gelar_depan!: string;

    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Email' }) })
    email!: string;

    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Jabatan' }) })
    jabatan!: string;


    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Jenis Kepegawaian' }) })
    jenis_kepegawaian!: string;


    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Status Kepegawaian' }) })
    status_kepegawaian!: string;

    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Status Aktif' }) })
    status_active!: string;


    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Phone number' }) })
    phone!: string;


    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Work unit' }) })
    unit_id!: string;

    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Pangkat/Golongan' }) })
    pangkat_id!: string;

    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Simpeg Id' }) })
    simpeg_id!: string;
}

export class DTO_ValidationUpdate {
    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'NIK' }) })
    nik!: string;

    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'NIP' }) })
    nip!: string;


    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Name' }) })
    nama!: string;

    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Gelar' }) })
    gelar_depan!: string;

    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Email' }) })
    email!: string;

    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Jabatan' }) })
    jabatan!: string;

    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Jenis Kepegawaian' }) })
    jenis_kepegawaian!: string;


    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Status Kepegawaian' }) })
    status_kepegawaian!: string;

    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Status Aktif' }) })
    status_active!: string;


    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Phone number' }) })
    phone!: string;


    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Work unit' }) })
    unit_id!: string;

    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Pangkat/Golongan' }) })
    pangkat_id!: string;

    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Simpeg Id' }) })
    simpeg_id!: string;
}


export class DTO_ValidationSync {

    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Type name' }) })
    type_name!: string;
}