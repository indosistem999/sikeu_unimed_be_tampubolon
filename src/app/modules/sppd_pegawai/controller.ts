import { Request, Response } from 'express';
import MainRoutes from '../../../config/mainRoute';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import Services from './service';

class SppdPegawaiController extends MainRoutes {
    public routes(): void {
        /** [GET] - Fetch Data */
        this.router.get('/', authMiddleware, async (req: Request, res: Response) => {
            await Services.fetch(req, res);
        });

        /** [POST] - Create Data */
        this.router.post(
            '/',
            authMiddleware,
            async (req: I_RequestCustom, res: Response) => {
                await Services.store(req, res);
            }
        );

        /** [GET] - Find By Id  */
        this.router.get('/:pegawai_id', authMiddleware, async (req: Request, res: Response) => {
            await Services.fetchById(req, res);
        });

        /** [PUT] - Update Data */
        this.router.put(
            '/:pegawai_id',
            authMiddleware,
            async (req: I_RequestCustom, res: Response) => {
                await Services.update(req, res);
            }
        );

        /** [DELETE] - Delete Data */
        this.router.delete('/:pegawai_id', authMiddleware, async (req: Request, res: Response) => {
            await Services.softDelete(req, res);
        });
    }
}

export default new SppdPegawaiController().router;
