import { Request, Response } from 'express';
import MainRoutes from '../../../config/mainRoute';
import MasterModuleService from './service';
import { adminAuthMiddleware, authMiddleware } from '../../middlewares/auth.middleware';
import { showFile, uploadImageToStorage } from '../../../config/storages';
import ReqValidation from './validation';

class MasterModuleController extends MainRoutes {
    public routes(): void {
        /** [POST] - Create New Module */
        this.router.post(
            '/',
            adminAuthMiddleware,
            uploadImageToStorage.single('file_icon'),
            ReqValidation.createValidation,
            async (req: Request, res: Response) => {
                await MasterModuleService.store(req, res);
            }
        );

        /** Fetch Module */
        this.router.get('/', authMiddleware, async (req: Request, res: Response) => {
            await MasterModuleService.fetchAll(req, res);
        });

        this.router.get('/files/:type/:filename', async (req: Request, res: Response) => {
            await showFile(req, res);
        });

        /** Find Module */
        this.router.get('/:module_id', authMiddleware, ReqValidation.paramValidation, async (req: Request, res: Response) => {
            await MasterModuleService.fetchById(req, res);
        });

        /** Update Module */
        this.router.put(
            '/:module_id',
            authMiddleware,
            uploadImageToStorage.single('file_icon'),
            ReqValidation.paramValidation,
            ReqValidation.updateValidation,
            async (req: Request, res: Response) => {
                await MasterModuleService.update(req, res);
            }
        );

        /** Delete Module */
        this.router.delete('/:module_id', authMiddleware, ReqValidation.paramValidation, async (req: Request, res: Response) => {
            await MasterModuleService.softDelete(req, res);
        });
    }
}

export default new MasterModuleController().router;
