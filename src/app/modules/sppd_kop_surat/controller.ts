import { Request, Response } from 'express';
import MainRoutes from '../../../config/mainRoute';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import ReqValidation from './validation';
import Services from './service';
import { authMiddleware } from '../../middlewares/auth.middleware';

class KopSuratController extends MainRoutes {
    public routes(): void {
        // Get All
        this.router.get('/', authMiddleware, async (req: Request, res: Response) => {
            await Services.fetch(req, res);
        });

        // Create
        this.router.post('/', authMiddleware, ReqValidation.createValidation, async (req: I_RequestCustom, res: Response) => {
            await Services.store(req, res);
        });

        // Batch Create
        this.router.post('/batch', authMiddleware, ReqValidation.createBatchValidation, async (req: I_RequestCustom, res: Response) => {
            await Services.storeBatch(req, res);
        });

        // Get By Id
        this.router.get('/:kopsurat_id', authMiddleware, ReqValidation.paramValidation, async (req: Request, res: Response) => {
            await Services.fetchById(req, res);
        });

        // Update
        this.router.put(
            '/:kopsurat_id',
            authMiddleware,
            ReqValidation.paramValidation,
            ReqValidation.updateValidation,
            async (req: I_RequestCustom, res: Response) => {
                await Services.update(req, res);
            }
        );

        // Batch Update
        this.router.put(
            '/batch',
            authMiddleware,
            ReqValidation.updateBatchValidation,
            async (req: I_RequestCustom, res: Response) => {
                await Services.updateBatch(req, res);
            }
        );

        // Delete
        this.router.delete('/:kopsurat_id', authMiddleware, ReqValidation.paramValidation, async (req: I_RequestCustom, res: Response) => {
            await Services.softDelete(req, res);
        });

        // Preview
        this.router.get('/:kopsurat_id/preview', authMiddleware, ReqValidation.paramValidation, async (req: Request, res: Response) => {
            await Services.preview(req, res);
        });
    }
}

export default new KopSuratController().router; 