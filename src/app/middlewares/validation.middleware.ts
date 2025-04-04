import { I_FileOptionInterface } from "../../interfaces/app.interface";
import { Request } from 'express'
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';
import AppDataSource from "../../config/dbconfig";// Replace with your entity name and path
import { MasterModule } from "../../database/models/MasterModule";
import { MessageDialog } from "../../lang";
import { IsNull } from "typeorm";

@ValidatorConstraint({ async: true })
export class validateOrderNumberModule implements ValidatorConstraintInterface {
    private moduleRepo = AppDataSource.getRepository(MasterModule);

    async validate(order_number: number, args: ValidationArguments): Promise<boolean> {
        // Await the asynchronous call to ensure proper validation
        const existingRecord = await this.moduleRepo.findOne({
            where: { order_number, deleted_at: IsNull() },
        });

        return !existingRecord; // Return true if no record exists
    }

    defaultMessage(args: ValidationArguments): string {
        return MessageDialog.__('error.existed.orderNumber', { value: `${args.value}` });
    }
}


// Custom property decorator
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
        const req: any = args?.object['req']; // Access req object
        const module_id = req?.params?.module_id;

        // Await the asynchronous call to ensure proper validation
        const rows = await this.moduleRepo.find({
            where: { order_number, deleted_at: IsNull() },
        });

        const find = rows?.find((f: MasterModule) => f.module_id != module_id)

        if (find) {
            return false
        }

        return true
    }

    defaultMessage(args: ValidationArguments): string {
        return MessageDialog.__('error.existed.orderNumber', { value: `${args.value}` });
    }
}
