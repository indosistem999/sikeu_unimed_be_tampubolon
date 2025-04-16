import { IsNotEmpty, IsOptional } from 'class-validator';
import { MessageDialog } from '../../../lang';

export class DTO_ValidationCreate {

    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Budget name' }) })
    budget_name!: string;

    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Budget start date' }) })
    budget_start_date!: Date

    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Budget end date' }) })
    budget_end_date!: Date
}

export class DTO_ValidationUpdate {

    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Budget name' }) })
    budget_name!: string;

    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Budget start date' }) })
    budget_start_date!: Date

    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Budget end date' }) })
    budget_end_date!: Date
}