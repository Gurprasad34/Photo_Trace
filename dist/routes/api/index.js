import express from 'express';
import { photoRoutes } from './photoRoutes.js';
// import { userRoutes } from './userRoutes.js';
const router = express.Router();
// Use user and photo routes
// router.use('/users', userRoutes);
router.use('/photos', photoRoutes);
export default router;
