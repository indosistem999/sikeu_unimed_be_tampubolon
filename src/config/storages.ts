import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs'
import crypto from 'crypto'
import { Config as cfg } from '../constanta';
import { I_ResultService } from '../interfaces/app.interface';
import { sendErrorResponse } from '../lib/utils/response.util';


const BASE_URL = `${cfg.AppHost}:${cfg.AppPort}`

const uploadPath = path.join(__dirname, '../../uploads');

// Ensure the folders exist (if not, create them)
if (!fs.existsSync(path.join(uploadPath, 'icon'))) {
    fs.mkdirSync(path.join(uploadPath, 'icon'), { recursive: true });
}

if (!fs.existsSync(path.join(uploadPath, 'logo'))) {
    fs.mkdirSync(path.join(uploadPath, 'logo'), { recursive: true });
}

if (!fs.existsSync(path.join(uploadPath, 'images'))) {
    fs.mkdirSync(path.join(uploadPath, 'images'), { recursive: true });
}

const multerStorage = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb: Function) {
        if (file.fieldname === 'file_icon') {
            cb(null, path.join(uploadPath, 'icon')); // Save file_icon in 'uploads/icon'
        } else if (file.fieldname === 'file_logo') {
            cb(null, path.join(uploadPath, 'logo')); // Save file_logo in 'uploads/logo'
        } else if (file.fieldname === 'file_image') {
            cb(null, path.join(uploadPath, 'images')); // Save file_logo in 'uploads/logo'
        } else {
            cb(new Error('Invalid file type'), ''); // Handle error if fieldname is wrong
        }
    },
    filename: function (req: Request, file: Express.Multer.File, cb: Function) {
        const timestamp = Date.now();
        const randomString = crypto.randomBytes(8).toString('hex'); // Generate a random string
        const ext = path.extname(file.originalname); // Get file extension (e.g., .jpg, .png)
        const newFileName = `${randomString}-${timestamp}${ext}`; // Random filename + timestamp
        cb(null, newFileName);
    }
});


export const uploadImageToStorage = multer({
    storage: multerStorage,
    limits: {
        fileSize: 10 * 1024 * 1024 // Limit file size to 10MB
    },
    fileFilter: function (req: Request, file: Express.Multer.File, cb: Function) {
        const filetypes = /jpeg|jpg|png|gif/; // Allowed file types
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
});

export const makeFullUrlFile = (filePath: string, pathSlug: string = 'master-module'): any => {
    if (filePath != null && filePath != '' && filePath != undefined) {
        return `${BASE_URL}/api/v1/${pathSlug}/files/${filePath}`;
    }
    return filePath
}



export const getFileFromStorage = (type: string, filename: string): I_ResultService => {
    const validTypes = ['icon', 'logo', 'images']; // Ensure valid directories

    if (!validTypes.includes(type)) {
        return {
            success: false,
            message: 'Invalid file type',
            record: null
        }
    }

    const filePath = path.join(uploadPath, type, filename);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        return {
            success: false,
            message: 'File not found',
            record: filePath
        }
    }

    return {
        success: true,
        message: 'Get file success',
        record: filePath
    }
}


export const removeFileInStorage = (fileName: string): I_ResultService => {
    // Change this to your actual file name
    const filePath = path.join(uploadPath, fileName);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return {
            success: true,
            message: `${fileName} was found and deleted.`,
            record: filePath
        }
    } else {
        return {
            success: true,
            message: `${fileName} does not exist.`,
            record: filePath
        }
    }
}


export const showFile = (req: Request, res: Response): Response | any => {
    const { type, filename } = req.params;
    const result = getFileFromStorage(type, filename);

    if (!result?.success) {
        return sendErrorResponse(res, 400, result.message, result.record);
    }
    else {
        return res.sendFile(result.record);
    }

}

