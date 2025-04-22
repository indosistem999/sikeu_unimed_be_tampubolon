import AppDataSource from "../../../config/dbconfig";
import { ProcedureList } from "../../../constanta";
import { I_RequestCustom, I_ResultService } from "../../../interfaces/app.interface";
import { MessageDialog } from "../../../lang";


export class SppdBerandaRepository {

    setupErrorMessage(error: any): I_ResultService {
        return {
            success: false,
            message: error.message,
            record: error
        }
    }

    async fetchBoard(req: I_RequestCustom): Promise<I_ResultService> {
        try {
            await AppDataSource.query(`CALL RefreshMaterializedViewSppdBerandaTop()`);
            const result = await AppDataSource.query('SELECT * FROM mv_sppd_beranda_top ORDER BY last_updated DESC LIMIT 1');
            if (result?.length > 0) {
                return {
                    success: true,
                    message: MessageDialog.__('success.sppdBeranda.fetchBoard'),
                    record: {
                        total_surat: result[0].total_surat,
                        total_pegawai: result[0].total_pegawai,
                        total_satker: result[0].total_satker
                    }
                }
            }

            return {
                success: false,
                message: MessageDialog.__('error.failed.fetchBoard'),
                record: result
            }



        } catch (error: any) {
            return this.setupErrorMessage(error)
        }
    }

    async fetchChart(req: I_RequestCustom, filters: Record<string, any>): Promise<I_ResultService> {

        const startYear: number = Number(filters?.start_year)
        const endYear: number = Number(filters?.end_year)
        const typeName: string = filters?.type_name;
        const unitId: string = filters?.unit_id;

        try {
            let results: Record<string, any>[] | any[] = [];
            let errors: any = null;

            switch (typeName) {
                case "cost_statistics_month":

                    break;

                case "travel_statistics_year":
                    const rowsTravelYearly = await AppDataSource.query(
                        `CALL ${ProcedureList.SppdBeranda.ChartYearly}(?, ?, ?)`,
                        [startYear, endYear, unitId]
                    );

                    if (rowsTravelYearly?.length > 0) {
                        results = rowsTravelYearly[0]
                    }
                    else {
                        errors = rowsTravelYearly;
                    }
                    break;

                case "cost_statistics_year":

                    break;


                case "travel_statistics_month":
                default:
                    const rowsTravelMonthly = await AppDataSource.query(
                        `CALL ${ProcedureList.SppdBeranda.ChartMonthly}(?, ?, ?)`,
                        [startYear, endYear, unitId]
                    );

                    if (rowsTravelMonthly?.length > 0) {
                        results = rowsTravelMonthly[0]
                    }
                    else {
                        errors = rowsTravelMonthly;
                    }
                    break;
            }


            if (errors != null) {
                return {
                    success: false,
                    message: '',
                    record: errors
                }
            }


            return {
                success: true,
                message: MessageDialog.__('success.sppdBeranda.fetchChart'),
                record: results
            }


        } catch (error: any) {
            return this.setupErrorMessage(error)
        }
    }
}