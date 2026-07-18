import express from 'express';
import { signup, login, getMe } from '../controllers/authController.js';
import { registerValidation, loginValidation } from '../middleware/validators.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', registerValidation, signup);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);

export default router;
