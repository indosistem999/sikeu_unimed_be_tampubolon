import { Request, Response } from 'express';
import MainRoutes from '../../../config/mainRoute';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import Services from './service';
import { multerUpload, showFile, uploadImageToStorage } from '../../../config/storages';
import ReqValidation from './validation';

class SppdPegawaiController extends MainRoutes {
    public routes(): void {
        /** [GET] - Fetch Data */
        this.router.get('/', authMiddleware, async (req: Request, res: Response) => {
            await Services.fetch(req, res);
        });


        /** [POST] - Create Data */
        this.router.post(
            '/',
            authMiddleware,
            uploadImageToStorage.single('file_image'),
            ReqValidation.createValidation,
            async (req: I_RequestCustom, res: Response) => {
                await Services.store(req, res);
            }
        );


        this.router.post('/import/excel', authMiddleware, multerUpload({ type: 'single', name: 'file' }), async (req: Request, res: Response) => {
            await Services.excelImport(req, res)
        });


        /** Fetch File */
        this.router.get('/files/:type/:filename', async (req: Request, res: Response) => {
            await showFile(req, res);
        });

        this.router.get('/download/template/excel', authMiddleware, async (req: Request, res: Response) => {
            await Services.downloadTemplateExcel(req, res)
        });

        this.router.post('/synchronize-sppd-pegawai', authMiddleware, multerUpload({ type: 'single', name: 'file' }), async (req: Request, res: Response) => {
            await Services.postSynchronize(req, res)
        });

        /** [GET] - Find By Id  */
        this.router.get(
            '/:pegawai_id',
            authMiddleware,
            ReqValidation.paramValidation,
            async (req: Request, res: Response) => {
                await Services.fetchById(req, res);
            }
        );

        /** [PUT] - Update Data */
        this.router.put(
            '/:pegawai_id',
            authMiddleware,
            uploadImageToStorage.single('file_image'),
            ReqValidation.paramValidation,
            ReqValidation.updateValidation,
            async (req: I_RequestCustom, res: Response) => {
                await Services.update(req, res);
            }
        );

        /** [DELETE] - Delete Data */
        this.router.delete(
            '/:pegawai_id',
            authMiddleware,
            uploadImageToStorage.single('file_image'),
            ReqValidation.paramValidation,
            async (req: Request, res: Response) => {
                await Services.softDelete(req, res);
            }
        );
    }
}

export default new SppdPegawaiController().router;
