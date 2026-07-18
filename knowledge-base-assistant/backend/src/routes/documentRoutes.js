import express from 'express';
import protect from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { paginationValidation } from '../middleware/validators.js';
import {
  uploadDocument,
  getDocuments,
  getDocumentById,
  previewDocument,
  deleteDocument,
} from '../controllers/documentController.js';

const router = express.Router();

router.use(protect); // every document route requires authentication

router.post('/', upload.single('file'), uploadDocument);
router.get('/', paginationValidation, getDocuments);
router.get('/:id', getDocumentById);
router.get('/:id/preview', previewDocument);
router.delete('/:id', deleteDocument);

export default router;
