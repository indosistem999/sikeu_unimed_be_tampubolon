import { IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { MessageDialog } from '../../../lang';
import { PositionType } from '../../../interfaces/enum.interface';

export class DTO_ValidationCreate {
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'NIP' }) })
    nip!: string;

    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Name' }) })
    full_name!: string;

    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Position Name' }) })
    posititon_name!: string;

    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Position Type' }) })
    @IsEnum(PositionType, { message: MessageDialog.__('error.invalid.enumValue', { label: 'Position Type' }) })
    position_type!: PositionType;


    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Start Date Position' }) })
    start_date_position!: string;

    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Job Category' }) })
    job_category_id!: string;

}

export class DTO_ValidationUpdate {
    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'NIP' }) })
    nip!: string;

    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Name' }) })
    full_name!: string;

    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Position Name' }) })
    posititon_name!: string;

    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Position Type' }) })
    @IsEnum(PositionType, { message: MessageDialog.__('error.invalid.enumValue', { label: 'Position Type' }) })
    position_type!: PositionType;


    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Start Date Position' }) })
    start_date_position!: string;

    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Job Category' }) })
    job_category_id!: string;
}