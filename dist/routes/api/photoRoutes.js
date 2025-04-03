import express from 'express';
import { uploadPhoto } from '../../controllers/photoController.js';
import multer from 'multer'; // Handles middleware for file uplouds
const router = express.Router();
const storage = multer.diskStorage({
    destination: './uploads/', // Ensure this directory exists
    filename: (_req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });
const uploadMiddleware = upload.single('image');
// Route to upload a photo
router.post('/upload', uploadMiddleware, uploadPhoto);
// Route to get photos by user ID
// router.get('/:userId', getPhotosByUser);
export { router as photoRoutes };
