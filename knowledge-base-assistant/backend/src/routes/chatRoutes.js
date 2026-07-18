import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { askQuestionValidation, paginationValidation } from '../middleware/validators.js';
import { askQuestion, getHistory } from '../controllers/chatController.js';

const router = express.Router();

router.use(protect);

router.post('/ask', askQuestionValidation, askQuestion);
router.get('/history', paginationValidation, getHistory);

export default router;
