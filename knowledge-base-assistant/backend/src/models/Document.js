import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Document name is required'],
      trim: true,
    },
    originalFileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ['pdf', 'txt', 'md'],
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    sizeInBytes: {
      type: Number,
      required: true,
    },
    storagePath: {
      type: String,
      required: true, // path on disk (or URL, if swapped for cloud storage later)
    },
    extractedText: {
      type: String,
      default: '',
      select: false, // large field — only pull it in explicitly when needed (e.g. for AI context)
    },
    extractionStatus: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },
    extractionError: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Speeds up "search documents by name" queries
documentSchema.index({ owner: 1, name: 'text' });

const Document = mongoose.model('Document', documentSchema);

export default Document;
