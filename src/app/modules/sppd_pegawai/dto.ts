import { IsNotEmpty, IsOptional } from 'class-validator';
import { MessageDialog } from '../../../lang';

export class DTO_ValidationCreate {
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Golongan romawi' }) })
    golongan_romawi!: string;

    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Golongan angka' }) })
    golongan_angka!: string;

    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Pangkat' }) })
    pangkat!: string;
}

export class DTO_ValidationUpdate {
    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Golongan romawi' }) })
    golongan_romawi!: string;

    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Golongan angka' }) })
    golongan_angka!: string;

    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Pangkat' }) })
    pangkat!: string;
}