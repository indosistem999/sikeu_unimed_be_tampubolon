import { Response } from 'express';
import MainRoutes from '../../../config/mainRoute';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import Services from './service';

class HistoryImportPegawaiController extends MainRoutes {
    public routes(): void {
        /** [GET] - Fetch Data */
        this.router.get('/', authMiddleware, async (req: I_RequestCustom, res: Response) => {
            await Services.fetch(req, res);
        });
    }
}

export default new HistoryImportPegawaiController().router;
