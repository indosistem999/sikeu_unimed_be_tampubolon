import { IsNotEmpty, IsOptional } from 'class-validator';
import { MessageDialog } from '../../../lang';
import { IsOrderNumberMenuCreate, IsOrderNumberMenuUpdate } from './masterMenu.custom';

export class DTO_ValidationMenuCreate {
  @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Menu name' }) })
  name!: string;

  @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Menu slug' }) })
  slug!: string;

  @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Order number' }) })
  @IsOrderNumberMenuCreate()
  order_number!: number;
}


export class DTO_ValidationMenuUpdate {
  @IsOptional()
  @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Menu name' }) })
  name!: string;

  @IsOptional()
  @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Menu slug' }) })
  slug!: string;

  @IsOptional()
  @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Order number' }) })
  // @IsOrderNumberMenuUpdate()
  order_number!: number;
}