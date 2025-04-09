import { Request, Response } from 'express';
import MainRoutes from '../../../config/mainRoute';
import { adminAuthMiddleware } from '../../middlewares/auth.middleware';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import Service from './roleAssignModule.service'

class RoleAssignModuleController extends MainRoutes {
  public routes(): void {

    /** [GET] - Show all module by role */
    this.router.get(
      '/:role_id',
      adminAuthMiddleware,
      async (req: I_RequestCustom, res: Response) => {
        await Service.fetch(req, res)
      }
    );


    /** [POST] - Assign module to role */
    this.router.post(
      '/:role_id',
      adminAuthMiddleware,
      async (req: I_RequestCustom, res: Response) => {
        await Service.store(req, res)
      }
    );


    /** [POST] - Delete module from role */
    this.router.delete(
      '/:role_id/:module_id',
      adminAuthMiddleware,
      async (req: I_RequestCustom, res: Response) => {
        await Service.softDelete(req, res)
      }
    );
  }
}

export default new RoleAssignModuleController().router;
