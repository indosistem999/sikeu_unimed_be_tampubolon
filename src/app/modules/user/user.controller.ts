import { Request, Response } from 'express';
import MainRoutes from '../../../config/mainRoute';
import { adminAuthMiddleware } from '../../middlewares/auth.middleware';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import Services from './user.service'
import { uploadImageToStorage } from '../../../config/storages';
import ReqValidation from './user.validation';


class UserController extends MainRoutes {
    public routes(): void {
        /** [GET] - Fetch Data */
        this.router.get('/', adminAuthMiddleware, async (req: Request, res: Response) => {
            await Services.fetch(req, res);
        });

        /** [POST] - Create Data */
        this.router.post(
            '/',
            adminAuthMiddleware,
            uploadImageToStorage.single('file_image'),
            ReqValidation.createModuleValidation,
            async (req: I_RequestCustom, res: Response) => {
                await Services.store(req, res);
            }
        );

        /** [GET] - Get File Logo */
        this.router.get('/files/:type/:filename', async (req: Request, res: Response) => {
            await Services.showFile(req, res);
        });

        /** [GET] - Find By Id  */
        this.router.get('/:user_id', adminAuthMiddleware, ReqValidation.paramValidation, async (req: Request, res: Response) => {
            await Services.fetchById(req, res);
        });

        /** [PUT] - Update Data */
        this.router.put(
            '/:user_id',
            adminAuthMiddleware,
            uploadImageToStorage.single('file_image'),
            ReqValidation.paramValidation,
            ReqValidation.updateModuleValidation,
            async (req: I_RequestCustom, res: Response) => {
                await Services.update(req, res);
            }
        );

        /** [DELETE] - Delete Data */
        this.router.delete('/:user_id', adminAuthMiddleware, ReqValidation.paramValidation, async (req: Request, res: Response) => {
            await Services.softDelete(req, res);
        });
    }
}

export default new UserController().router;
