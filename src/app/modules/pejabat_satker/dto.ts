import { IsNotEmpty, IsOptional } from 'class-validator';
import { MessageDialog } from '../../../lang';

export class DTO_ValidationCreate {
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Kode transportasi' }) })
    code!: string;

    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Jenis transportasi' }) })
    name!: string;

}

export class DTO_ValidationUpdate {
    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Kode transportasi' }) })
    code!: string;

    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Jenis transportasi' }) })
    name!: string;
}