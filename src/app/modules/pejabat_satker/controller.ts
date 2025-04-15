import { Request, Response } from 'express';
import MainRoutes from '../../../config/mainRoute';
import { authMiddleware } from '../../middlewares/auth.middleware';
import Services from './service';
import ReqValidation from './validation';


class PejabatSatkerController extends MainRoutes {
    public routes(): void {
        /** [GET] - Fetch Data */
        this.router.get('/list-satker', authMiddleware, async (req: Request, res: Response) => {
            await Services.fetchUnitWorkGroup(req, res)
        });

        this.router.get('/list-pejabat/:unit_id', authMiddleware, ReqValidation.paramValidation, async (req: Request, res: Response) => {
            await Services.fetchOfficerGroup(req, res)
        });
    }
}

export default new PejabatSatkerController().router;
