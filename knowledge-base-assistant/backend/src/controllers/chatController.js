import Document from '../models/Document.js';
import Conversation from '../models/Conversation.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { answerQuestionFromDocument } from '../services/groqService.js';


export const askQuestion = asyncHandler(async (req, res) => {
  const { documentId, question } = req.body;

  const document = await Document.findOne({ _id: documentId, owner: req.user._id }).select('+extractedText');

  if (!document) {
    throw new ApiError(404, 'Document not found');
  }

  if (document.extractionStatus !== 'success' || !document.extractedText) {
    throw new ApiError(
      422,
      'This document has no usable text to answer questions from. Try re-uploading it.'
    );
  }

  let answer;
  let status = 'success';

  try {
    answer = await answerQuestionFromDocument(document.extractedText, question);
  } catch (error) {
    
    status = 'failed';
    answer = 'Sorry, the AI service failed to generate a response. Please try again in a moment.';

    const conversation = await Conversation.create({
      user: req.user._id,
      document: document._id,
      question,
      answer,
      status,
    });

    
    console.error(`Groq API error: ${error.message}`);
    throw new ApiError(502, 'AI service is currently unavailable. Please try again shortly.', {
      conversationId: conversation._id,
    });
  }

  const conversation = await Conversation.create({
    user: req.user._id,
    document: document._id,
    question,
    answer,
    status,
  });

  res.status(201).json(new ApiResponse(201, 'Answer generated successfully', { conversation }));
});


export const getHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const search = req.query.search?.trim();
  const { documentId } = req.query;

  const filter = { user: req.user._id };
  if (documentId) filter.document = documentId;
  if (search) {
    filter.$or = [
      { question: { $regex: search, $options: 'i' } },
      { answer: { $regex: search, $options: 'i' } },
    ];
  }

  const [conversations, total] = await Promise.all([
    Conversation.find(filter)
      .populate('document', 'name fileType')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Conversation.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, 'Chat history fetched successfully', {
      conversations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    })
  );
});
