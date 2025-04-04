import { IsNotEmpty } from 'class-validator';
import { MessageDialog } from '../../../lang';
import { IsOrderNumberModuleUnique } from '../../middlewares/validation.middleware';

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
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Module Name' }) })
    module_name!: string;

    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Module Name' }) })
    module_path!: string;

    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Order Number' }) })
    @IsOrderNumberModuleUnique()
    order_number!: number
}