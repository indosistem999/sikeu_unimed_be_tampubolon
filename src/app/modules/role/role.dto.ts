import { IsNotEmpty, IsOptional } from "class-validator";
import { MessageDialog } from "../../../lang";

export class DTO_ValidationRoleCreate {
  @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Role namme' }) })
  role_name!: string;
}

export class DTO_ValidationRoleUpdate {
  @IsOptional()
  @IsNotEmpty({ message: MessageDialog.__('error.missing.requiredEntry', { label: 'Role name' }) })
  role_name!: string;
}