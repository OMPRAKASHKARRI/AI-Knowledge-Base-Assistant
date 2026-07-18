import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      index: true,
    },
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
    },
    answer: {
      type: String,
      required: true,
    },
    // Captured for transparency/debugging — helps explain why an answer
    // may be wrong (e.g. AI failure fallback vs a real generated answer)
    status: {
      type: String,
      enum: ['success', 'failed'],
      default: 'success',
    },
  },
  { timestamps: true }
);

conversationSchema.index({ question: 'text', answer: 'text' });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
