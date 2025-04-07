import express from 'express';
import { photoRoutes } from './photoRoutes.js';
const router = express.Router();
router.use('/photos', photoRoutes); // mounts /api/photos
export default router;
