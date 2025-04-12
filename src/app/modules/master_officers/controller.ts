import { Request, Response } from 'express';
import MainRoutes from '../../../config/mainRoute';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { I_RequestCustom } from '../../../interfaces/app.interface';

class MasterOfficerController extends MainRoutes {
  public routes(): void {
    /** [GET] - Fetch Data */
    this.router.get('/', authMiddleware, async (req: Request, res: Response) => {
    });

    /** [POST] - Create Data */
    this.router.post(
      '/',
      authMiddleware,
      async (req: I_RequestCustom, res: Response) => {
      }
    );

    /** [GET] - Find By Id  */
    this.router.get('/:officers_id', authMiddleware, async (req: Request, res: Response) => {
    });

    /** [PUT] - Update Data */
    this.router.put(
      '/:officers_id',
      authMiddleware,
      async (req: I_RequestCustom, res: Response) => {
      }
    );

    /** [DELETE] - Delete Data */
    this.router.delete('/:officers_id', authMiddleware, async (req: Request, res: Response) => {

    });
  }
}

export default new MasterOfficerController().router;
