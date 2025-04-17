import { IsNull, Like } from "typeorm";
import { findAndCreatePangkat, findAndCreateWorkUnit } from "../../app/modules/sppd_pegawai/helper";
import AppDataSource from "../../config/dbconfig";
import { Logger } from "../../config/logger";
import { subscribeMessage } from "../../config/rabbitmq";
import { ExchangeList, QueueList } from "../../constanta";
import { HistorySyncPegawai } from "../../database/models/HistorySyncPegawai";
import { SPPDPegawai } from "../../database/models/SPPDPegawai";
import { I_HistoryDescription } from "../../interfaces/app.interface";
import { standartDateISO } from "../../lib/utils/common.util";
import { synchronizeSimpeg } from "../../lib/utils/thirdParty.util";


const syncDataDosen = async (
    history_id: string,
    rowData: Record<string, any>[],
    option: I_HistoryDescription,
    errorCapture: Record<string, any>[],
    successCapture: Record<string, any>[],
    created_at: Date,
    created_by: any
): Promise<void> => {
    const repoPegawai = AppDataSource.getRepository(SPPDPegawai)
    const repoHistory = AppDataSource.getRepository(HistorySyncPegawai)

    for (let i = 0; i < rowData.length; i++) {
        const element = rowData[i];

        const payload: Record<string, any> = {
            nip: element.nip,
            nik: null,
            nama: `${element.namaNogelar}, ${element.gelarBlkng}`,
            gelar_depan: element.gelarDepan,
            email: element.email,
            phone: element.noHp,
            jabatan: element.jabatan_fung,
            jenis_kepegawaian: 'dosen',
            status_kepegawaian: null,
            status_active: element.statusAktif,
            simpeg_id: element.nidn,
            photo: element.foto_dosen,
            synchronize_date: created_at,
            work_unit: {
                unit_code: element.kodeUnit,
                unit_type: null,
                unit_name: element.unit,

            },
            golongan: {
                pangkat: element.pangkat,
                golongan_romawi: element.golongan,
                golongan_angka: element.kodeGolongan,
            }
        }

        const { work_unit, golongan, ...rest } = payload

        //  Update data
        const resultWorkUnit = await findAndCreateWorkUnit({
            ...work_unit,
            created_by,
            created_at
        })


        if (!resultWorkUnit?.success) {
            option.total_failed = option.total_failed + 1;
            errorCapture.push({
                error_row: element,
                message: `Failed found, create work unit ${element['kodeUnit']}`
            })
            continue;
        }

        const resultPangkat = await findAndCreatePangkat({
            ...golongan,
            created_by,
            created_at
        })


        if (!resultPangkat?.success) {
            option.total_failed = option.total_failed + 1;
            errorCapture.push({
                error_row: element,
                message: `Failed found, create pangkat ${element['golongan']}, ${element['pangkat']}`
            })
            continue
        }

        const employee = await repoPegawai.findOne({
            where: [
                { nip: Like(`%${rest.nip}%`), deleted_at: IsNull() }
            ]
        });

        if (rest?.status_active != null && rest?.status_active == '00') {
            rest.status_active = 0
        }
        else {
            rest.status_active == 1
        }

        if (employee) {
            const resultUpdate = await repoPegawai.update(employee.pegawai_id, {
                ...employee,
                ...rest,
                pangkat_golongan: resultPangkat.data,
                work_unit: resultWorkUnit.data,
                updated_by: created_by,
                updated_at: created_at
            })

            if (!resultUpdate) {
                option.total_failed = option.total_failed + 1;
                errorCapture.push({
                    error_row: resultUpdate,
                    message: `Failed to update  sppd pegawai Nik : (${rest.nik}), Nip : (${rest.nip})`
                })
                continue;
            }

            option.total_updated = option.total_updated + 1;

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
                created_at: created_at,
                pangkat_golongan: resultPangkat.data,
                work_unit: resultWorkUnit.data
            }

            const resultInsert = await repoPegawai.save(repoPegawai.create(payloadInsert))

            if (!resultInsert) {
                option.total_failed = option.total_failed + 1;
                errorCapture.push({
                    error_row: payloadInsert,
                    message: `Failed to create a new sppd pegawai Nik : (${rest.nik}), Nip : (${rest.nip})`
                })
                continue;
            }

            option.total_created = option.total_created + 1;

            successCapture.push({
                row: resultInsert,
                message: `Success insert a new sppd pegawai Nik : (${rest.nik}), Nip : (${rest.nip})`
            })


        }


    }

    await repoHistory.update(history_id, {
        description: JSON.stringify(option),
        type_name: 'dosen',
        execute_status: 'success',
        execute_report: JSON.stringify({
            success: successCapture,
            errors: errorCapture
        }),
        execute_time: created_at,
        executor_id: created_by,
        updated_at: new Date(standartDateISO()),
        created_by: created_by
    })
}


const syncDataPegawai = async (
    history_id: string,
    rowData: Record<string, any>[],
    option: I_HistoryDescription,
    errorCapture: Record<string, any>[],
    successCapture: Record<string, any>[],
): Promise<void> => {
    const repoPegawai = AppDataSource.getRepository(SPPDPegawai)

    for (let i = 0; i < rowData.length; i++) {
        const element = rowData[i];

    }
}

const integrateSyncSppdPegawai = async (exchangeName: string, queueName: string, message: string): Promise<void> => {
    console.log({ MESSAGE: JSON.parse(message), EXCHANGE: exchangeName, QUEUE: queueName })
    const repoHistory = AppDataSource.getRepository(HistorySyncPegawai)

    const { history_id, payload } = JSON.parse(message)?.row_data;
    const { type_name, user, today } = payload
    let errorCapture: Record<string, any>[] = [];
    let successCapture: Record<string, any>[] = [];

    const optionProp: I_HistoryDescription = {
        total_created: 0,
        total_row: 0,
        total_updated: 0,
        total_failed: 0,
        message: ''
    }

    try {
        const rowSync = await synchronizeSimpeg(type_name)

        if (rowSync?.success) {
            // Syncronize success
            if (type_name == 'dosen') {
                await syncDataDosen(
                    history_id,
                    rowSync?.record,
                    optionProp,
                    errorCapture,
                    successCapture,
                    today,
                    user?.user_id
                )
            }
            else {
                await syncDataPegawai(
                    history_id,
                    rowSync?.record,
                    optionProp,
                    errorCapture,
                    successCapture,
                )
            }
        }
        else {
            errorCapture.push({
                error_row: rowSync?.record
            })

            optionProp.message = rowSync?.message

            await repoHistory.update(history_id, {
                description: JSON.stringify(optionProp),
                execute_status: 'failed',
                execute_report: JSON.stringify({
                    success: successCapture,
                    errors: errorCapture
                }),
                execute_time: today,
                executor_id: user?.user_id,
                updated_at: new Date(standartDateISO()),
                updated_by: user?.user_id
            })


            Logger().info(`Rows data are empty`, rowSync?.record)
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
            executor_id: user?.user_id,
            updated_at: new Date(standartDateISO()),
            created_by: user?.user_id
        })

        Logger().error(
            `Error import integration sppd pegawai from exchange ${exchangeName}, queue '${queueName}'`, error
        );
    }
}

export const eventSyncSppdPegawai = async (): Promise<void> => {
    const queue: string = QueueList.SyncFile.SppdPegawai;
    const exchange: string = ExchangeList.SyncFile.SppdPegawai

    console.info(`Now System checking exchange and queue (${exchange}, ${queue}) response from broker`)

    try {
        await subscribeMessage(exchange, queue, integrateSyncSppdPegawai)
    } catch (err: any) {
        console.info(`Error response checking exchange and queue (${exchange}, ${queue}) : `, err)
    }
}