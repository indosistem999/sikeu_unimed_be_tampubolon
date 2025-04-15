import { Request, Response } from 'express';
import MainRoutes from '../../../config/mainRoute';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import Services from './service';
import ReqValidation from './validation';

class PejabatSatkerController extends MainRoutes {
    public routes(): void {
        /** [GET] - Fetch Data */
        this.router.get('/list-group-satker', authMiddleware, async (req: Request, res: Response) => {
            await Services.fetchGroup(req, res)
        });

        this.router.get('/list-pejabat-satker/:unit_id', authMiddleware, async (req: Request, res: Response) => {
            await Services.fetchById(req, res)
        });
    }
}

export default new PejabatSatkerController().router;
