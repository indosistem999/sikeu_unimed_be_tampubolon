import { IsEmail, IsNotEmpty, IsOptional, MinLength } from "class-validator";
import { MessageDialog } from "../../../lang";

export class DTO_ValidationUserCreate {
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Name' }) })
    name!: string;

    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Email' }) })
    @IsEmail({}, { message: MessageDialog.__('error.invalid.emailFormatted') })
    email!: string;

    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Gender' }) })
    gender!: string;

    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Phone Number' }) })
    phone_number!: string;

    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Password' }) })
    password!: string;
}

export class DTO_ValidationUserUpdate {
    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Name' }) })
    name!: string;

    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Email' }) })
    @IsEmail({}, { message: MessageDialog.__('error.invalid.emailFormatted') })
    email!: string;

    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Gender' }) })
    gender!: string;

    @IsOptional()
    @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Phone Number' }) })
    phone_number!: string;
}


export class DTO_ValidationChangePassword {
    @MinLength(8, { message: MessageDialog.__('error.other.passwordLength', { number: '8' }) })
    new_password!: string;

    @IsNotEmpty({
        message: MessageDialog.__('error.missing.requiredEntry', { label: 'Confirm password' }),
    })
    confirm_password!: string;
}