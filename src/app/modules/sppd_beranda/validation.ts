import { I_RequestCustom } from "../../../interfaces/app.interface";
import { Response, NextFunction } from 'express'
import { sendErrorResponse } from "../../../lib/utils/response.util";


interface QueryParams {
    start_year?: number;
    end_year?: number;
    unit_id?: string;
    type_statistic?: string;
}

function hasRequiredQueryParams(request?: { query?: QueryParams }): boolean {
    const query = request?.query;
    return (
        typeof query?.start_year !== 'undefined' &&
        typeof query?.end_year !== 'undefined' &&
        typeof query?.unit_id !== 'undefined' &&
        typeof query?.type_statistic !== 'undefined'
    );
}


class SppdBerandaValidation {

    // Create
    async chartValidation(req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> {
        if (!hasRequiredQueryParams(req)) {
            sendErrorResponse(res, 400, 'Please entry query param [start_year, end_year, unit_id and type_statistic]', req?.query)
        }
        else {
            const typeName: any = req?.query?.type_statistic?.toString().toLowerCase();

            if (!([
                "travel_statistics_month",
                "cost_statistics_month",
                "travel_statistics_year",
                "cost_statistics_year"
            ].includes(typeName))) {
                sendErrorResponse(res, 400, 'Type statistic is not valid', req?.query)
            }
            else {
                next()
            }

        }

    }
}

export default new SppdBerandaValidation();