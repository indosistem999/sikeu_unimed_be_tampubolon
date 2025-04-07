import { Request, Response } from 'express';
import MainRoutes from '../../../config/mainRoute';
import { adminAuthMiddleware } from '../../middlewares/auth.middleware';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import Services from './workUnit.service';
import WorkUnitValidation from './workUnit.validation';

class WorkUnitController extends MainRoutes {
  public routes(): void {
    /** [GET] - Fetch Data */
    this.router.get('/', adminAuthMiddleware, async (req: Request, res: Response) => {
      await Services.fetch(req, res);
    });

    /** [POST] - Create Data */
    this.router.post(
      '/',
      adminAuthMiddleware,
      WorkUnitValidation.createValidation,
      async (req: I_RequestCustom, res: Response) => {
        await Services.store(req, res);
      }
    );

    /** [GET] - Find By Id  */
    this.router.get('/:unit_id', adminAuthMiddleware, WorkUnitValidation.paramValidation, async (req: Request, res: Response) => {
      await Services.fetchById(req, res);
    });

    /** [PUT] - Update Data */
    this.router.put(
      '/:unit_id',
      adminAuthMiddleware,
      WorkUnitValidation.paramValidation,
      WorkUnitValidation.updateValidation,
      async (req: I_RequestCustom, res: Response) => {
        await Services.update(req, res);
      }
    );

    /** [DELETE] - Delete Data */
    this.router.delete('/:unit_id', adminAuthMiddleware, WorkUnitValidation.paramValidation, async (req: Request, res: Response) => {
      await Services.softDelete(req, res);
    });
  }
}

export default new WorkUnitController().router;
