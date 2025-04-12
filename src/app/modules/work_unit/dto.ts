import { IsNotEmpty, IsOptional } from 'class-validator';
import { MessageDialog } from '../../../lang';

export class DTO_ValidationWorkUnitCreate {
  @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Unit code' }) })
  unit_code!: string;

  @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Abbreviation' }) })
  unit_type!: string;

  @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Unit name' }) })
  unit_name!: string;
}

export class DTO_ValidationWorkUnitUpdate {
  @IsOptional()
  @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Unit code' }) })
  unit_code!: string;

  @IsOptional()
  @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Abbreviation' }) })
  unit_type!: string;

  @IsOptional()
  @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Unit name' }) })
  unit_name!: string;
}