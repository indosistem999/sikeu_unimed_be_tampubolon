import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { MessageDialog } from '../../../lang';
import { Match } from '../../../lib/utils/common.util';

/** DTO for Login Validation */
export class DTO_ValidationLogin {
  @IsEmail({}, { message: MessageDialog.__('error.invalid.emailFormatted') })
  email!: string;

  @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Password' }) })
  @MinLength(6, { message: MessageDialog.__('error.other.passwordLength', { number: '6' }) })
  password!: string;

  @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Security Answer' }) })
  security_question_answer!: string
}

export class DTO_ValidationRegister {
  @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'First Name' }) })
  first_name!: string;

  @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Last Name' }) })
  last_name!: string;

  @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Email' }) })
  @IsEmail({}, { message: MessageDialog.__('error.invalid.emailFormatted') })
  email!: string;

  @MinLength(6, { message: MessageDialog.__('error.other.passwordLength', { number: '6' }) })
  password!: string;

  @IsNotEmpty({
    message: MessageDialog.__('error.missing.requiredEntry', { label: 'Confirm password' }),
  })
  @Match('password', { message: MessageDialog.__('error.missing.passwordMatch') })
  confirm_password!: string;
}

export class DTO_ValidationForgotPassword {
  @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Email' }) })
  @IsEmail({}, { message: MessageDialog.__('error.invalid.emailFormatted') })
  email!: string;
}
