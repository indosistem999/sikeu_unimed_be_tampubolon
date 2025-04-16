import { Request, Response } from 'express';
import MainRoutes from '../../../config/mainRoute';
import { authMiddleware } from '../../middlewares/auth.middleware';
import Services from './service';

class UserLogController extends MainRoutes {
    public routes(): void {
        /** [GET] - Fetch Data */
        this.router.get('/', authMiddleware, async (req: Request, res: Response) => {
            await Services.fetch(req, res);
        });
    }
}

export default new UserLogController().router;
