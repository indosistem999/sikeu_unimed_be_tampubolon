import { Response } from 'express';
import MainRoutes from '../../../config/mainRoute';
import { authMiddleware } from '../../middlewares/auth.middleware';
import Services from './service';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import ReqValidation from './validation'

class SppdBerandaController extends MainRoutes {
    public routes(): void {
        /** [GET] - Fetch Data */
        this.router.get('/graph-board', authMiddleware, async (req: I_RequestCustom, res: Response) => {
            await Services.fetchBoard(req, res);
        });

        this.router.get('/graph-chart', authMiddleware, ReqValidation.chartValidation, async (req: I_RequestCustom, res: Response) => {
            await Services.fetchChart(req, res);
        });
    }
}

export default new SppdBerandaController().router;
