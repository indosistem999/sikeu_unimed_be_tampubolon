import { Router, Request, Response } from 'express';
import MainRoutes from '../../../config/mainRoute';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import Services from './service';
import ReqValidation from './validation';
import { CreateSppdDto, UpdateSppdDto } from './dto';
import { validate } from 'class-validator';
import { sendErrorResponse } from '../../../lib/utils/response.util';
import { MessageDialog } from '../../../lang';
import { uploadImageToStorage, showFile } from '../../../config/storages';

class SppdSuratTugasController extends MainRoutes {
    constructor() {
        super();
        this.routes();
    }

    public routes(): void {
        /** [GET] - Fetch Data */
        this.router.get('/', authMiddleware, async (req: Request, res: Response) => {
            await Services.fetch(req, res);
        });

        /** [POST] - Create Data */
        this.router.post(
            '/',
            authMiddleware,
            ReqValidation.createValidation,
            async (req: I_RequestCustom, res: Response) => {
                await Services.store(req, res);
            }
        );

        /** [GET] - Find By Id  */
        this.router.get('/:surat_tugas_id', authMiddleware, ReqValidation.paramValidation, async (req: Request, res: Response) => {
            await Services.fetchById(req, res);
        });

        /** [PUT] - Update Data */
        this.router.put(
            '/:surat_tugas_id',
            authMiddleware,
            ReqValidation.paramValidation,
            ReqValidation.updateValidation,
            async (req: I_RequestCustom, res: Response) => {
                await Services.update(req, res);
            }
        );

        /** [DELETE] - Delete Data */
        this.router.delete('/:surat_tugas_id', authMiddleware, ReqValidation.paramValidation, async (req: I_RequestCustom, res: Response) => {
            await Services.softDelete(req, res);
        });

        /** [GET] - Preview Pegawai By Surat Tugas ID */
        this.router.get('/:surat_tugas_id/pegawai', authMiddleware, ReqValidation.paramValidation, async (req: Request, res: Response) => {
            await Services.previewPegawai(req, res);
        });

        /** [POST] - Upload Undangan for a Surat Tugas */
        this.router.post(
            '/:surat_tugas_id/upload-undangan',
            authMiddleware,
            ReqValidation.paramValidation,
            uploadImageToStorage.single('file_undangan'),
            ReqValidation.uploadUndanganValidation,
            async (req: I_RequestCustom, res: Response) => {
                await this.uploadUndangan(req, res);
            }
        );

        /** [GET] - Get File Undangan */
        this.router.get('/files/undangan/:filename', async (req: Request, res: Response) => {
            req.params.type = 'undangan';
            await showFile(req, res);
        });

        /** SPPD Routes */
        this.router.post('/:surat_tugas_id/sppd',
            authMiddleware,
            ReqValidation.paramValidation,
            async (req: Request, res: Response) => {
                await this.createSppd(req, res);
            }
        );

        this.router.put('/:surat_tugas_id/sppd/:sppd_id',
            authMiddleware,
            ReqValidation.paramValidation,
            async (req: Request, res: Response) => {
                await this.updateSppd(req, res);
            }
        );

        this.router.delete('/:surat_tugas_id/sppd/:sppd_id',
            authMiddleware,
            ReqValidation.paramValidation,
            async (req: Request, res: Response) => {
                await this.deleteSppd(req, res);
            }
        );

        this.router.get('/:surat_tugas_id/sppd/:sppd_id',
            authMiddleware,
            ReqValidation.paramValidation,
            async (req: Request, res: Response) => {
                await this.previewSppd(req, res);
            }
        );
    }

    /** SPPD Operations */
    private async createSppd(req: Request, res: Response): Promise<Response> {
        try {
            const suratTugasId = req.params.surat_tugas_id;
            const dto = new CreateSppdDto();
            Object.assign(dto, req.body);

            const errors = await validate(dto);
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors
                });
            }

            const result = await Services.createSppd(suratTugasId, dto, (req as I_RequestCustom).user?.user_id);

            return res.status(200).json({
                success: true,
                message: 'Success create SPPD',
                record: result
            });
        } catch (error) {
            return sendErrorResponse(res, 500, MessageDialog.__('error.failed.storeSPPD'), error);
        }
    }

    private async updateSppd(req: Request, res: Response): Promise<Response> {
        try {
            const { surat_tugas_id, sppd_id } = req.params;
            const dto = new UpdateSppdDto();
            Object.assign(dto, req.body);

            const errors = await validate(dto);
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors
                });
            }

            const result = await Services.updateSppd(surat_tugas_id, sppd_id, dto, (req as I_RequestCustom).user?.user_id);

            return res.status(200).json({
                success: true,
                message: 'Success update SPPD',
                record: result
            });
        } catch (error) {
            return sendErrorResponse(res, 500, MessageDialog.__('error.failed.updateSPPD'), error);
        }
    }

    private async deleteSppd(req: Request, res: Response): Promise<Response> {
        try {
            const { surat_tugas_id, sppd_id } = req.params;
            const result = await Services.deleteSppd(surat_tugas_id, sppd_id, (req as I_RequestCustom).user?.user_id);

            return res.status(200).json({
                success: true,
                message: 'Success delete SPPD',
                record: result
            });
        } catch (error) {
            return sendErrorResponse(res, 500, MessageDialog.__('error.failed.deleteSPPD'), error);
        }
    }

    private async previewSppd(req: Request, res: Response): Promise<Response> {
        try {
            const { surat_tugas_id, sppd_id } = req.params;
            const result = await Services.previewSppd(surat_tugas_id, sppd_id);

            return res.status(200).json({
                success: true,
                message: 'Success get SPPD detail',
                record: result
            });
        } catch (error) {
            return sendErrorResponse(res, 500, MessageDialog.__('error.failed.previewSPPD'), error);
        }
    }

    private async uploadUndangan(req: I_RequestCustom, res: Response): Promise<Response> {
        try {
            const suratTugasId = req.params.surat_tugas_id;
            const fileName = req.file ? req.file.filename : null;

            if (!fileName) {
                return sendErrorResponse(res, 400, 'No file uploaded', null);
            }

            const result = await Services.updateUndangan(suratTugasId, fileName, req.user?.user_id);

            return res.status(200).json({
                success: true,
                message: 'Success upload undangan',
                record: result
            });
        } catch (error) {
            return sendErrorResponse(res, 500, MessageDialog.__('error.failed.uploadUndangan'), error);
        }
    }
}

export default new SppdSuratTugasController().router; 