import { Response } from 'express';
import MainRoutes from '../../../config/mainRoute';
import { adminAuthMiddleware } from '../../middlewares/auth.middleware';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import Service from './featureAccess.service'

class FeatureAccessController extends MainRoutes {
  public routes(): void {
    /** [POST] - Insert or update features (menu access module for role) */
    this.router.post(
      '/:role_id',
      adminAuthMiddleware,
      async (req: I_RequestCustom, res: Response) => {
        await Service.store(req, res)
      }
    );


    this.router.get('/:role_id/:module_id', adminAuthMiddleware, async (req: I_RequestCustom, res: Response) => {
      await Service.fetch(req, res)
    })
  }
}

export default new FeatureAccessController().router;
