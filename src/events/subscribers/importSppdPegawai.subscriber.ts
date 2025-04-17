
import { Logger } from "../../config/logger";
import { subscribeMessage } from "../../config/rabbitmq";
import { ExchangeList, QueueList } from "../../constanta";
import AppDataSource from "../../config/dbconfig";
import { SPPDPegawai } from "../../database/models/SPPDPegawai";
import { IsNull, Like } from "typeorm";
import { HistoryImportPegawai } from "../../database/models/HistoryImportPegawai";
import { standartDateISO } from "../../lib/utils/common.util";
import { findAndCreateWorkUnit, findAndCreatePangkat } from "../../app/modules/sppd_pegawai/helper";
import { I_HistoryDescription } from "../../interfaces/app.interface";




const importSppdPegawaiIntegration = async (exchangeName: string, queueName: string, message: string): Promise<void> => {
    const repository = AppDataSource.getRepository(SPPDPegawai)
    const repoHistory = AppDataSource.getRepository(HistoryImportPegawai)
    let errorCapture: Record<string, any>[] = [];
    let successCapture: Record<string, any>[] = [];
    const { origin, history_id } = JSON.parse(message)?.row_data
    const { data, today, created_by } = origin;

    const optionProp: I_HistoryDescription = {
        total_created: 0,
        total_row: 0,
        total_updated: 0,
        total_failed: 0,
        message: ''
    }

    try {
        if (data?.length > 0) {

            optionProp.total_row = data.length;

            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                const {
                    unit_code,
                    unit_type,
                    unit_name,
                    golongan_romawi,
                    golongan_angka,
                    pangkat,
                    ...rest
                } = element



                //  Update data
                const resultWorkUnit = await findAndCreateWorkUnit({
                    unit_code,
                    unit_type,
                    unit_name,
                    created_by: created_by,
                    created_at: today
                })


                if (!resultWorkUnit?.success) {
                    optionProp.total_failed = optionProp.total_failed + 1;
                    errorCapture.push({
                        error_row: element,
                        message: `Failed found, create work unit ${unit_code}`
                    })
                    continue;
                }

                const resultPangkat = await findAndCreatePangkat({
                    pangkat,
                    golongan_romawi,
                    golongan_angka,
                    created_by: created_by,
                    created_at: today
                })


                if (!resultPangkat?.success) {
                    optionProp.total_failed = optionProp.total_failed + 1;
                    errorCapture.push({
                        error_row: element,
                        message: `Failed found, create pangkat ${golongan_romawi}, ${pangkat}`
                    })
                    continue
                }



                const employee = await repository.findOne({
                    where: [
                        { nik: Like(`%${rest.nik}%`), deleted_at: IsNull() },
                        { nip: Like(`%${rest.nip}%`), deleted_at: IsNull() }
                    ]
                });

                if (rest?.status_active != null && (rest?.status_active?.toLowerCase() == 'aktif' || rest?.status_active?.toLowerCase() == 'active')) {
                    rest.status_active = 1
                }
                else {
                    rest.status_active == 0
                }


                if (employee) {
                    const resultUpdate = await repository.update(employee.pegawai_id, {
                        ...employee,
                        ...rest,
                        pangkat_golongan: resultPangkat.data,
                        work_unit: resultWorkUnit.data,
                        updated_by: created_by,
                        updated_at: today
                    })

                    if (!resultUpdate) {
                        optionProp.total_failed = optionProp.total_failed + 1;
                        errorCapture.push({
                            error_row: resultUpdate,
                            message: `Failed to update  sppd pegawai Nik : (${rest.nik}), Nip : (${rest.nip})`
                        })
                        continue;
                    }

                    optionProp.total_updated = optionProp.total_updated + 1;

                    successCapture.push({
                        row: resultUpdate,
                        message: `Success insert a new sppd pegawai Nik : (${rest.nik}), Nip : (${rest.nip})`
                    })


                }
                else {

                    // Insert new Data
                    const payloadInsert: Record<string, any> = {
                        ...rest,
                        created_by: created_by,
                        created_at: today,
                        pangkat_golongan: resultPangkat.data,
                        work_unit: resultWorkUnit.data
                    }

                    const resultInsert = await repository.save(repository.create(payloadInsert))

                    if (!resultInsert) {
                        optionProp.total_failed = optionProp.total_failed + 1;
                        errorCapture.push({
                            error_row: payloadInsert,
                            message: `Failed to create a new sppd pegawai Nik : (${rest.nik}), Nip : (${rest.nip})`
                        })
                        continue;
                    }

                    optionProp.total_created = optionProp.total_created + 1;

                    successCapture.push({
                        row: resultInsert,
                        message: `Success insert a new sppd pegawai Nik : (${rest.nik}), Nip : (${rest.nip})`
                    })


                }
            }

            await repoHistory.update(history_id, {
                description: JSON.stringify(optionProp),
                execute_status: 'success',
                execute_report: JSON.stringify({
                    success: successCapture,
                    errors: errorCapture
                }),
                execute_time: today,
                executor_id: created_by,
                updated_at: new Date(standartDateISO()),
                created_by: created_by
            })
        }
        else {
            errorCapture.push({
                error_row: { data, today, created_by }
            })

            optionProp.message = `Rows data are empty`

            await repoHistory.update(history_id, {
                description: JSON.stringify(optionProp),
                execute_status: 'failed',
                execute_report: JSON.stringify({
                    success: successCapture,
                    errors: errorCapture
                }),
                execute_time: today,
                executor_id: created_by,
                updated_at: new Date(standartDateISO()),
                updated_by: created_by
            })


            Logger().info(`Rows data are empty`, { data, today, created_by })
        }


    } catch (error: any) {
        optionProp.message = error.message
        await repoHistory.update(history_id, {
            description: JSON.stringify(optionProp),
            execute_status: 'failed',
            execute_report: JSON.stringify({
                success: successCapture,
                errors: errorCapture
            }),
            execute_time: today,
            executor_id: created_by,
            updated_at: new Date(standartDateISO()),
            created_by: created_by
        })

        Logger().error(
            `Error import integration sppd pegawai from exchange ${exchangeName}, queue '${queueName}'`, error
        );
    }
}

export const eventSppdPegawaiImportIntegration = async (): Promise<void> => {
    const queue: string = QueueList.ImportFile.SppdPegawai;
    const exchange: string = ExchangeList.ImportFile.SppdPegawai

    console.info(`Now System checking exchange and queue (${exchange}, ${queue}) response from broker`)

    try {
        await subscribeMessage(exchange, queue, importSppdPegawaiIntegration)
    } catch (err: any) {
        console.info(`Error response checking exchange and queue (${exchange}, ${queue}) : `, err)
    }
}