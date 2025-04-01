import express from 'express';
import { uploadPhoto } from '../../controllers/photoController.js';

const router = express.Router();

// Route to upload a photo
router.post('/upload', uploadPhoto);

// Route to get photos by user ID
// router.get('/:userId', getPhotosByUser);

export { router as photoRoutes}