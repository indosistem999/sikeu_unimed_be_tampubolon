import { Request, Response } from 'express';
import MainRoutes from '../../../config/mainRoute';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import Services from './service';
import ReqValidation from './validation';

class SPPDJenisTransportasiController extends MainRoutes {
    public routes(): void {
        /** [GET] - Fetch Data */
        this.router.get('/', authMiddleware, async (req: Request, res: Response) => {
            await Services.fetch(req, res);
        });

        /** [POST] - Create Data */
        this.router.post(
            '/',
            authMiddleware,
            ReqValidation.createValidation,
            async (req: I_RequestCustom, res: Response) => {
                await Services.store(req, res);
            }
        );

        /** [GET] - Find By Id  */
        this.router.get('/:transportation_type_id', authMiddleware, ReqValidation.paramValidation, async (req: Request, res: Response) => {
            await Services.fetchById(req, res);
        });

        /** [PUT] - Update Data */
        this.router.put(
            '/:transportation_type_id',
            authMiddleware,
            ReqValidation.paramValidation,
            ReqValidation.updateValidation,
            async (req: I_RequestCustom, res: Response) => {
                await Services.update(req, res);
            }
        );

        /** [DELETE] - Delete Data */
        this.router.delete('/:transportation_type_id', authMiddleware, ReqValidation.paramValidation, async (req: Request, res: Response) => {
            await Services.softDelete(req, res);
        });
    }
}

export default new SPPDJenisTransportasiController().router;
