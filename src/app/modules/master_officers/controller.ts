import { Request, Response } from 'express';
import MainRoutes from '../../../config/mainRoute';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import ReqValidation from './validation'
import Service from './service'


class MasterOfficerController extends MainRoutes {
  public routes(): void {
    /** [GET] - Fetch Data */
    this.router.get('/', authMiddleware, async (req: Request, res: Response) => {
      await Service.fetch(req, res)
    });

    /** [POST] - Create Data */
    this.router.post(
      '/',
      authMiddleware,
      ReqValidation.createValidation,
      async (req: I_RequestCustom, res: Response) => {
        await Service.store(req, res)
      }
    );

    /** [GET] - Find By Id  */
    this.router.get('/:officers_id', authMiddleware, ReqValidation.paramValidation, async (req: Request, res: Response) => {
      await Service.fetchById(req, res)
    });

    /** [PUT] - Update Data */
    this.router.put(
      '/:officers_id',
      authMiddleware,
      ReqValidation.paramValidation,
      ReqValidation.updateValidation,
      async (req: I_RequestCustom, res: Response) => {
        await Service.update(req, res)
      }
    );

    /** [DELETE] - Delete Data */
    this.router.delete('/:officers_id', authMiddleware, ReqValidation.paramValidation, async (req: Request, res: Response) => {
      await Service.softDelete(req, res)
    });
  }
}

export default new MasterOfficerController().router;
