import { Request, Response } from 'express';
import MainRoutes from '../../../config/mainRoute';
import MasterModuleService from './masterModule.service'
import { adminAuthMiddleware, authMiddleware } from '../../middlewares/auth.middleware';
import { uploadImageToStorage } from '../../../config/storages';
import MasterModuleValidation from './masterModule.validation'


class MasterModuleController extends MainRoutes {
    public routes(): void {
        /** [POST] - Create New Module */
        this.router.post(
            '/',
            adminAuthMiddleware,
            uploadImageToStorage.fields([
                { name: 'file_icon', maxCount: 1 },
                { name: 'file_logo', maxCount: 1 }
            ]),
            MasterModuleValidation.createModuleValidation,
            async (req: Request, res: Response) => {
                await MasterModuleService.store(req, res)
            }
        );

        this.router.get('/', authMiddleware, async (req: Request, res: Response) => {
            await MasterModuleService.fetchAll(req, res);
        })

        this.router.get('/:module_id', authMiddleware, async (req: Request, res: Response) => {
            await MasterModuleService.fetchById(req, res)
        })

        this.router.delete('/:module_id', authMiddleware, async (req: Request, res: Response) => {
            await MasterModuleService.softDelete(req, res)
        })
    }
}

export default new MasterModuleController().router
