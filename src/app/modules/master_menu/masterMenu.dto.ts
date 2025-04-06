import { IsNotEmpty, IsOptional } from 'class-validator';
import { MessageDialog } from '../../../lang';

export class DTO_ValidationMasterIdentity {
  @IsOptional()
  @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Name' }) })
  name!: string;

  @IsOptional()
  @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Phone' }) })
  phone!: string;

  @IsOptional()
  @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Email' }) })
  email!: string;

  @IsOptional()
  @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Address' }) })
  address!: string;


  @IsOptional()
  @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Website' }) })
  website!: string;
}