import { Request, Response } from 'express';
import MainRoutes from '../../../config/mainRoute';
import { adminAuthMiddleware, } from '../../middlewares/auth.middleware';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import MasterIdentityService from './service';
import { showFile, uploadImageToStorage } from '../../../config/storages';
import MasterIdentityValidation from './validation';

class MasterIdentityController extends MainRoutes {
  public routes(): void {

    /** [GET] - Fetch Data */
    this.router.get('/', adminAuthMiddleware, async (req: Request, res: Response) => {
      await MasterIdentityService.fetch(req, res);
    })


    /** [POST] - Login Account */
    this.router.post('/', adminAuthMiddleware, uploadImageToStorage.single('file_logo'), MasterIdentityValidation.createMasterIdentityValidation, async (req: Request, res: Response) => {
      await MasterIdentityService.store(req, res);
    });


    /** [GET] - Get File Logo */
    this.router.get('/files/:type/:filename', async (req: Request, res: Response) => {
      await showFile(req, res);
    });

    /** [GET] - Find By Id  */
    this.router.get('/:identity_id', adminAuthMiddleware, async (req: Request, res: Response) => {
      await MasterIdentityService.fetchById(req, res);
    });

    /** [PUT] - Update */
    this.router.put('/:identity_id', adminAuthMiddleware, uploadImageToStorage.single('file_logo'), MasterIdentityValidation.createMasterIdentityValidation, async (req: Request, res: Response) => {
      await MasterIdentityService.update(req, res);
    });

    /** [DELETE] - Verification OTP */
    this.router.delete('/:identity_id', adminAuthMiddleware, async (req: Request, res: Response) => {
      await MasterIdentityService.softDelete(req, res);
    })

  }
}

export default new MasterIdentityController().router
