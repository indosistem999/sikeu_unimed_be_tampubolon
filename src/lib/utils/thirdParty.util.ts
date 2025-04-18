import axios from 'axios';
import { Config as cfg } from '../../constanta'
import { I_ResultService } from '../../interfaces/app.interface';

export const synchronizeSimpeg = async (typeName: string = 'dosen'): Promise<I_ResultService> => {
    try {
        const url = typeName?.toLowerCase() == 'dosen' ? cfg.SimpegDosen : cfg.SimpegPegawai
        const response = await axios.get(url);

        if (response.status === 200 && response.data) {
            return {
                success: true,
                message: 'Get data simpeg success',
                record: response.data
            }
        } else {
            return {
                success: false,
                message: 'Invalid response from the API',
                record: response.data
            }
        }


    } catch (error: any) {
        return {
            success: false,
            message: 'Error fetching data',
            record: error
        }
    }
}