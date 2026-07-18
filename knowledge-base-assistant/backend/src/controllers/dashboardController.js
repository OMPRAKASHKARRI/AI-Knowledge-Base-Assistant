import Document from '../models/Document.js';
import Conversation from '../models/Conversation.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';


export const getDashboardStats = asyncHandler(async (req, res) => {
  const ownerFilter = { owner: req.user._id };
  const userFilter = { user: req.user._id };

  const [totalDocuments, totalQuestions, recentUploads, recentConversations, failedExtractions] =
    await Promise.all([
      Document.countDocuments(ownerFilter),
      Conversation.countDocuments(userFilter),
      Document.find(ownerFilter).sort({ createdAt: -1 }).limit(5).select('name fileType createdAt extractionStatus'),
      Conversation.find(userFilter)
        .populate('document', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
        .select('question document createdAt status'),
      Document.countDocuments({ ...ownerFilter, extractionStatus: 'failed' }),
    ]);

  res.status(200).json(
    new ApiResponse(200, 'Dashboard stats fetched successfully', {
      totalDocuments,
      totalQuestions,
      failedExtractions,
      recentUploads,
      recentConversations,
    })
  );
});
