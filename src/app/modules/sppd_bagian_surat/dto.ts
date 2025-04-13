import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MessageDialog } from '../../../lang';

export class DTO_ValidationCreate {
    @IsString({ message: () => MessageDialog.__('error.validation.bagianSurat.nameRequired') })
    @IsNotEmpty()
    name!: string;

    @IsString({ message: () => MessageDialog.__('error.validation.bagianSurat.descriptionString') })
    @IsOptional()
    description!: string;
}

export class DTO_ValidationUpdate {
    @IsString({ message: () => MessageDialog.__('error.validation.bagianSurat.nameRequired') })
    @IsNotEmpty()
    name!: string;

    @IsString({ message: () => MessageDialog.__('error.validation.bagianSurat.descriptionString') })
    @IsOptional()
    description!: string;
} 