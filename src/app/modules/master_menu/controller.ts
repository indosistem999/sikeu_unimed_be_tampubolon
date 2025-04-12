import { Request, Response } from 'express';
import MainRoutes from '../../../config/mainRoute';
import { adminAuthMiddleware } from '../../middlewares/auth.middleware';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import Services from './service';
import { showFile, uploadImageToStorage } from '../../../config/storages';
import ReqValidation from './validation';

class MasterMenuController extends MainRoutes {
  public routes(): void {
    /** [GET] - Fetch Data */
    this.router.get('/', adminAuthMiddleware, async (req: Request, res: Response) => {
      await Services.fetch(req, res);
    });

    /** [POST] - Login Account */
    this.router.post(
      '/',
      adminAuthMiddleware,
      uploadImageToStorage.single('file_icon'),
      ReqValidation.createValidation,
      async (req: I_RequestCustom, res: Response) => {
        await Services.store(req, res, 'parent');
      }
    );

    this.router.post(
      '/sub-menu',
      adminAuthMiddleware,
      uploadImageToStorage.single('file_icon'),
      async (req: I_RequestCustom, res: Response) => {
        await Services.store(req, res, 'child');
      }
    );

    /** [GET] - Get File Logo */
    this.router.get('/files/:type/:filename', async (req: Request, res: Response) => {
      await showFile(req, res);
    });

    /** [GET] - Find By Id  */
    this.router.get(
      '/:menu_id',
      adminAuthMiddleware,
      ReqValidation.paramValidation,
      async (req: Request, res: Response) => {
        await Services.fetchById(req, res);
      }
    );

    /** [PUT] - Update */
    this.router.put(
      '/:menu_id',
      adminAuthMiddleware,
      uploadImageToStorage.single('file_icon'),
      ReqValidation.paramValidation,
      ReqValidation.updateValidation,
      async (req: I_RequestCustom, res: Response) => {
        await Services.update(req, res);
      }
    );

    /** [DELETE] - Verification OTP */
    this.router.delete(
      '/:menu_id',
      adminAuthMiddleware,
      ReqValidation.paramValidation,
      async (req: Request, res: Response) => {
        await Services.softDelete(req, res);
      }
    );
  }
}

export default new MasterMenuController().router;
