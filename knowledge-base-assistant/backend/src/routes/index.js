import express from 'express';
import authRoutes from './authRoutes.js';
import documentRoutes from './documentRoutes.js';
import chatRoutes from './chatRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/documents', documentRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/', chatRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy', timestamp: new Date().toISOString() });
});

export default router;
