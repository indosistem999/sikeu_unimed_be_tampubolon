import { Request } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs'
import crypto from 'crypto'


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