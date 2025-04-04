import { I_FileOptionInterface } from "../../interfaces/app.interface";
import { Request } from 'express'
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';
import AppDataSource from "../../config/dbconfig";// Replace with your entity name and path
import { MasterModule } from "../../database/models/MasterModule";
import { MessageDialog } from "../../lang";

@ValidatorConstraint({ async: true })
export class validateOrderNumberModule implements ValidatorConstraintInterface {
    private moduleRepo = AppDataSource.getRepository(MasterModule);

    async validate(order_number: number, args: ValidationArguments): Promise<boolean> {
        // Await the asynchronous call to ensure proper validation
        const existingRecord = await this.moduleRepo.findOne({
            where: { order_number },
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

