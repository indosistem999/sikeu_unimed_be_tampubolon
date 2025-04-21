import { Request, Response } from 'express';
import MainRoutes from '../../../config/mainRoute';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import Services from './service'
import { showFile, uploadImageToStorage } from '../../../config/storages';
import ReqValidation from './validation';


class UserController extends MainRoutes {
    public routes(): void {
        /** [GET] - Fetch Data */
        this.router.get('/', authMiddleware, async (req: Request, res: Response) => {
            await Services.fetch(req, res);
        });

        /** [POST] - Create Data */
        this.router.post(
            '/',
            authMiddleware,
            uploadImageToStorage.single('file_image'),
            ReqValidation.createValidation,
            async (req: I_RequestCustom, res: Response) => {
                await Services.store(req, res);
            }
        );

        /** [GET] - Get File Logo */
        this.router.get('/files/:type/:filename', async (req: Request, res: Response) => {
            await showFile(req, res);
        });

        /** [GET] - Find By Id  */
        this.router.get('/:user_id', authMiddleware, ReqValidation.paramValidation, async (req: Request, res: Response) => {
            await Services.fetchById(req, res);
        });

        /** [PUT] - Update Data */
        this.router.put(
            '/:user_id',
            authMiddleware,
            uploadImageToStorage.single('file_image'),
            ReqValidation.paramValidation,
            ReqValidation.updateValidation,
            async (req: I_RequestCustom, res: Response) => {
                await Services.update(req, res);
            }
        );

        /** [DELETE] - Delete Data */
        this.router.delete('/:user_id', authMiddleware, ReqValidation.paramValidation, async (req: Request, res: Response) => {
            await Services.softDelete(req, res);
        });
    }
}

export default new UserController().router;
