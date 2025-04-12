import { IsNotEmpty, IsOptional } from 'class-validator';
import { MessageDialog } from '../../../lang';
import { IsOrderNumberModuleExisted, IsOrderNumberModuleUnique } from './custom';

export class DTO_ValidationModule {
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Module Name' }) })
    module_name!: string;

    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Module Name' }) })
    module_path!: string;

    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Order Number' }) })
    @IsOrderNumberModuleUnique()
    order_number!: number
}


export class DTO_ValidationModuleUpdate {
    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Module Name' }) })
    module_name!: string;

    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Module Name' }) })
    module_path!: string;

    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Order Number' }) })
    @IsOrderNumberModuleExisted()
    order_number!: number
}