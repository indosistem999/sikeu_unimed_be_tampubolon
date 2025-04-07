import { Request, Response } from 'express';
import MainRoutes from '../../../config/mainRoute';
import { adminAuthMiddleware, } from '../../middlewares/auth.middleware';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import Services from './masterMenu.service';
import { uploadImageToStorage } from '../../../config/storages';

class MasterMenuController extends MainRoutes {
  public routes(): void {

    /** [GET] - Fetch Data */
    this.router.get('/', adminAuthMiddleware, async (req: Request, res: Response) => {
      await Services.fetch(req, res);
    })


    /** [POST] - Login Account */
    this.router.post('/', adminAuthMiddleware, uploadImageToStorage.single('file_icon'), async (req: I_RequestCustom, res: Response) => {
      await Services.store(req, res, 'parent');
    });

    this.router.post('/sub-menu', adminAuthMiddleware, uploadImageToStorage.single('file_icon'), async (req: I_RequestCustom, res: Response) => {
      await Services.store(req, res, 'child');
    })


    /** [GET] - Get File Logo */
    this.router.get('/files/:type/:filename', async (req: Request, res: Response) => {
      await Services.showFile(req, res);
    });

    /** [GET] - Find By Id  */
    this.router.get('/:menu_id', adminAuthMiddleware, async (req: Request, res: Response) => {
      await Services.fetchById(req, res);
    });

    /** [PUT] - Update */
    this.router.put('/:menu_id', adminAuthMiddleware, uploadImageToStorage.single('file_icon'), async (req: I_RequestCustom, res: Response) => {
      await Services.update(req, res);
    });

    /** [DELETE] - Verification OTP */
    this.router.delete('/:menu_id', adminAuthMiddleware, async (req: Request, res: Response) => {
      await Services.softDelete(req, res);
    })

  }
}

export default new MasterMenuController().router
