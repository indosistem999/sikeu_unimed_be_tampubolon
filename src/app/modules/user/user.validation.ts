import { I_RequestCustom } from "../../../interfaces/app.interface";
import { Response, NextFunction } from 'express'
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { sendErrorResponse } from "../../../lib/utils/response.util";
import { MessageDialog } from "../../../lang";
import { DTO_ValidationUserCreate, DTO_ValidationUserUpdate } from "./user.dto";
import { allSchema as sc } from '../../../constanta'
import AppDataSource from "../../../config/dbconfig";
import { Users } from "../../../database/models/Users";
import { IsNull, Not } from "typeorm";

class UserValidation {
    async paramValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        if (!req?.params?.[sc.user.primaryKey]) {
            sendErrorResponse(
                res,
                422,
                MessageDialog.__('error.missing.requiredEntry', { label: 'User id' }),
                null
            );
        }
        else {
            next()
        }

    }

    async createValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        const dtoInstance = plainToClass(DTO_ValidationUserCreate, req?.body);
        const errors = await validate(dtoInstance);

        if (errors.length > 0) {
            sendErrorResponse(
                res,
                422,
                errors
                    .map((err) => {
                        return Object.values(err.constraints!).join(', ')
                    })
                    .flat()
                    .toString(),
                errors
            );
        }

        if (!req?.file) {
            sendErrorResponse(res, 422, MessageDialog.__('error.missing.fileUpload'), req.file);
        }

        const row = await AppDataSource.getRepository(Users)
            .findOne({ where: { email: req?.body?.email, deleted_at: IsNull() } })

        if (row) {
            sendErrorResponse(res, 400, MessageDialog.__('error.existed.hasRegistered', { item: `Email ${req?.body?.email}` }), { user_id: row?.user_id, email: row?.email, full_name: row?.full_name })
        }

        next();
    }

    async updateValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {

        const dtoInstance = plainToInstance(DTO_ValidationUserUpdate, req.body);
        (dtoInstance as any).req = req;


        const errors = await validate(dtoInstance);

        if (errors.length > 0) {
            sendErrorResponse(
                res,
                422,
                errors
                    .map((err) => {
                        return Object.values(err.constraints!).join(', ')
                    })
                    .flat()
                    .toString(),
                errors
            );
        }
        else {
            if (req?.body?.email) {
                const email: string = req?.body?.email;

                const row = await AppDataSource.getRepository(Users).findOne({
                    where: {
                        deleted_at: IsNull(),
                        email,
                        user_id: Not(req?.params?.[sc.user.primaryKey])
                    }
                })

                if (row) {
                    sendErrorResponse(
                        res,
                        422,
                        MessageDialog.__('error.existed.hasRegistered', { item: `User with ${email}` }),
                        { user_id: row?.user_id, email: row?.email, full_name: row?.full_name }
                    );
                }
                else {
                    next();
                }
            }
            else {
                next()
            }


        }

    }
}

export default new UserValidation();