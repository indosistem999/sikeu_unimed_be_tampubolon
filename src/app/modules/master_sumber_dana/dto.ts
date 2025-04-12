import { IsNotEmpty, IsOptional } from 'class-validator';
import { MessageDialog } from '../../../lang';

export class DTO_ValidationCreate {

  @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Source of funds code' }) })
  code!: string;

  @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Source of funds description' }) })
  description!: string
}

export class DTO_ValidationUpdate {

  @IsOptional()
  @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Source of funds code' }) })
  code!: string;

  @IsOptional()
  @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Source of funds description' }) })
  description!: string
}