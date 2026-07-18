import path from 'path';
import fs from 'fs/promises';
import Document from '../models/Document.js';
import Conversation from '../models/Conversation.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { extractText } from '../services/textExtractionService.js';

const EXT_TO_TYPE = { '.pdf': 'pdf', '.txt': 'txt', '.md': 'md' };

// @route  POST /api/documents
// @access Private
export const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No file uploaded. Please attach a PDF, TXT, or MD file.');
  }

  const ext = path.extname(req.file.originalname).toLowerCase();
  const fileType = EXT_TO_TYPE[ext];

  if (!fileType) {
    // Safety net — uploadMiddleware should already have blocked this
    await fs.unlink(req.file.path).catch(() => {});
    throw new ApiError(400, `Unsupported file type "${ext}"`);
  }

  // Create the document record first so we have an id even if extraction fails
  const document = await Document.create({
    owner: req.user._id,
    name: req.body.name?.trim() || req.file.originalname,
    originalFileName: req.file.originalname,
    fileType,
    mimeType: req.file.mimetype,
    sizeInBytes: req.file.size,
    storagePath: req.file.path,
  });

  const { text, status, error } = await extractText(req.file.path, fileType);

  document.extractedText = text;
  document.extractionStatus = status;
  document.extractionError = error;
  await document.save();

  const responseDoc = document.toObject();
  delete responseDoc.extractedText; // don't ship full text back on upload response

  res.status(201).json(new ApiResponse(201, 'Document uploaded successfully', { document: responseDoc }));
});

// @route  GET /api/documents
// @query  page, limit, search
// @access Private
export const getDocuments = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const search = req.query.search?.trim();

  const filter = { owner: req.user._id };
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  const [documents, total] = await Promise.all([
    Document.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Document.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, 'Documents fetched successfully', {
      documents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    })
  );
});

// @route  GET /api/documents/:id
// @access Private
export const getDocumentById = asyncHandler(async (req, res) => {
  const document = await Document.findOne({ _id: req.params.id, owner: req.user._id });

  if (!document) {
    throw new ApiError(404, 'Document not found');
  }

  res.status(200).json(new ApiResponse(200, 'Document fetched successfully', { document }));
});

// @route  GET /api/documents/:id/preview
// @access Private
export const previewDocument = asyncHandler(async (req, res) => {
  const document = await Document.findOne({ _id: req.params.id, owner: req.user._id }).select('+extractedText');

  if (!document) {
    throw new ApiError(404, 'Document not found');
  }

  if (document.extractionStatus !== 'success') {
    throw new ApiError(
      422,
      document.extractionError || 'This document has no extractable preview text'
    );
  }

  res.status(200).json(
    new ApiResponse(200, 'Document preview fetched', {
      name: document.name,
      fileType: document.fileType,
      preview: document.extractedText.slice(0, 3000),
      truncated: document.extractedText.length > 3000,
    })
  );
});

// @route  DELETE /api/documents/:id
// @access Private
export const deleteDocument = asyncHandler(async (req, res) => {
  const document = await Document.findOne({ _id: req.params.id, owner: req.user._id });

  if (!document) {
    throw new ApiError(404, 'Document not found');
  }

  // Remove the file from disk; don't fail the whole request if this errors
  // (e.g. file already missing) — the DB record is the source of truth
  await fs.unlink(document.storagePath).catch((err) => {
    console.warn(`Could not delete file on disk: ${err.message}`);
  });

  // Clean up related chat history so we don't leave orphaned conversations
  await Conversation.deleteMany({ document: document._id });
  await document.deleteOne();

  res.status(200).json(new ApiResponse(200, 'Document deleted successfully'));
});
