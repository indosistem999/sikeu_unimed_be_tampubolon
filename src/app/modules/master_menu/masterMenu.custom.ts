import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import AppDataSource from "../../../config/dbconfig";
import { MasterMenu } from "../../../database/models/MasterMenu";
import { IsNull } from "typeorm";
import { MessageDialog } from "../../../lang";
import { allSchema as sc } from '../../../constanta'

@ValidatorConstraint({ async: true })
export class validateOrderNumberMenu implements ValidatorConstraintInterface {
  private repository = AppDataSource.getRepository(MasterMenu);

  async validate(order_number: number, args: ValidationArguments): Promise<boolean> {
    // Await the asynchronous call to ensure proper validation
    const existingRecord = await this.repository.findOne({
      where: { order_number, deleted_at: IsNull(), parent: IsNull() },
    });

    return !existingRecord; // Return true if no record exists
  }

  defaultMessage(args: ValidationArguments): string {
    return MessageDialog.__('error.existed.orderNumber', { value: `${args.value}` });
  }
}


// Custom property decorator
export function IsOrderNumberMenuCreate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string): void {
    registerDecorator({
      name: 'IsOrderNumberMenuCreate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: validateOrderNumberMenu,
    });
  };
}







@ValidatorConstraint({ async: true })
export class validateOrderNumberMenuExisted implements ValidatorConstraintInterface {
  private repository = AppDataSource.getRepository(MasterMenu);

  async validate(order_number: number, args: ValidationArguments | any): Promise<boolean> {
    const req: any = args?.object['req'];
    const id = req?.params?.[sc.menu.primaryKey];

    // Await the asynchronous call to ensure proper validation
    const rows = await this.repository.find({
      where: { order_number, deleted_at: IsNull(), parent: IsNull() },
    });

    if (rows?.length > 0) {
      const find = rows?.find((f: any) => {
        return f.menu_id == id
      })

      if (!find || find === undefined) {
        return false
      }
    }

    return true
  }

  defaultMessage(args: ValidationArguments): string {
    return MessageDialog.__('error.existed.orderNumber', { value: `${args.value}` });
  }
}


// Custom property decorator
export function IsOrderNumberMenuUpdate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string): void {
    registerDecorator({
      name: 'IsOrderNumberMenuUpdate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: validateOrderNumberMenuExisted,
    });
  };
}


