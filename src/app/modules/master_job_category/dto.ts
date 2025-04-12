import { IsNotEmpty, IsOptional } from 'class-validator';
import { MessageDialog } from '../../../lang';

export class DTO_ValidationCreate {
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Job code' }) })
    code!: string;

    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Job name' }) })
    name!: string;

}

export class DTO_ValidationUpdate {
    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Job code' }) })
    code!: string;

    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Job name' }) })
    name!: string;
}