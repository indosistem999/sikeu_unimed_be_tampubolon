import { IsOptional, IsString, IsNumber } from 'class-validator';
import { MessageDialog } from '../../../lang';

export class DTO_ValidationCreate {
    @IsNumber({}, { message: () => MessageDialog.__('error.validation.kopSurat.orderNumber') })
    @IsOptional()
    order_number?: number;

    @IsString({ message: () => MessageDialog.__('error.validation.kopSurat.description') })
    @IsOptional()
    description?: string;

    @IsString({ message: () => MessageDialog.__('error.validation.kopSurat.fontType') })
    @IsOptional()
    font_type?: string;

    @IsString({ message: () => MessageDialog.__('error.validation.kopSurat.fontStyle') })
    @IsOptional()
    font_style?: string;

    @IsString({ message: () => MessageDialog.__('error.validation.kopSurat.fontSize') })
    @IsOptional()
    font_size?: string;
}

export class DTO_ValidationUpdate {
    @IsNumber({}, { message: () => MessageDialog.__('error.validation.kopSurat.orderNumber') })
    @IsOptional()
    order_number?: number;

    @IsString({ message: () => MessageDialog.__('error.validation.kopSurat.description') })
    @IsOptional()
    description?: string;

    @IsString({ message: () => MessageDialog.__('error.validation.kopSurat.fontType') })
    @IsOptional()
    font_type?: string;

    @IsString({ message: () => MessageDialog.__('error.validation.kopSurat.fontStyle') })
    @IsOptional()
    font_style?: string;

    @IsString({ message: () => MessageDialog.__('error.validation.kopSurat.fontSize') })
    @IsOptional()
    font_size?: string;
} 