import { Request, Response } from 'express';
import MainRoutes from '../../../config/mainRoute';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import Services from './service';
import ReqValidation from './validation';

class NotificationController extends MainRoutes {
    public routes(): void {
        /** [GET] - Fetch Data */
        this.router.get('/', authMiddleware, async (req: I_RequestCustom, res: Response) => {
            await Services.fetch(req, res);
        });

        this.router.get('/:notification_id', authMiddleware, ReqValidation.paramValidation, async (req: Request, res: Response) => {
            await Services.fetchById(req, res);
        });

        /** [POST] - Set Read */
        this.router.post(
            '/set-read',
            authMiddleware,
            ReqValidation.setReadValidation,
            async (req: I_RequestCustom, res: Response) => {
                await Services.setRead(req, res);
            }
        );
    }
}

export default new NotificationController().router;
