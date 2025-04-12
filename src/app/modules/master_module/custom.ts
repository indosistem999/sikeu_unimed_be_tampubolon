
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { MessageDialog } from "../../../lang";
import AppDataSource from "../../../config/dbconfig";
import { MasterModule } from "../../../database/models/MasterModule";
import { IsNull } from "typeorm";

@ValidatorConstraint({ async: true })
export class validateOrderNumberModule implements ValidatorConstraintInterface {
  private moduleRepo = AppDataSource.getRepository(MasterModule);

  async validate(order_number: number, args: ValidationArguments): Promise<boolean> {
    const existingRecord = await this.moduleRepo.findOne({
      where: { order_number, deleted_at: IsNull() },
    });

    return !existingRecord;
  }

  defaultMessage(args: ValidationArguments): string {
    return MessageDialog.__('error.existed.orderNumber', { value: `${args.value}` });
  }
}

// 👇 this now comes *after* the class is defined
export function IsOrderNumberModuleUnique(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string): void {
    registerDecorator({
      name: 'IsOrderNumberModuleUnique',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: validateOrderNumberModule,
    });
  };
}


@ValidatorConstraint({ async: true })
export class validateOrderNumberModuleExisted implements ValidatorConstraintInterface {
  private moduleRepo = AppDataSource.getRepository(MasterModule);

  async validate(order_number: number, args: ValidationArguments | any): Promise<boolean> {
    const req: any = args?.object['req'];
    const module_id = req?.params?.module_id;

    // Await the asynchronous call to ensure proper validation
    const rows = await this.moduleRepo.find({
      where: { order_number, deleted_at: IsNull() },
    });

    if (rows?.length > 0) {
      const find = rows?.find((f: any) => {
        return f.module_id == module_id
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
export function IsOrderNumberModuleExisted(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string): void {
    registerDecorator({
      name: 'IsOrderNumberModuleExisted',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: validateOrderNumberModuleExisted,
    });
  };
}

