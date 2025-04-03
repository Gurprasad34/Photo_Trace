import express from 'express';
import { uploadPhoto } from '../../controllers/photoController.js';
import multer from 'multer';
const router = express.Router();
const upload = multer({ dest: 'uploads/' });
router.post('/upload', upload.single('file'), uploadPhoto);
export default router;
