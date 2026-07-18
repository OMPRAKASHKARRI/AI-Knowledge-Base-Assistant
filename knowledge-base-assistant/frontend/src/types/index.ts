export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export type FileType = 'pdf' | 'txt' | 'md';
export type ExtractionStatus = 'pending' | 'success' | 'failed';

export interface DocumentItem {
  _id: string;
  owner: string;
  name: string;
  originalFileName: string;
  fileType: FileType;
  mimeType: string;
  sizeInBytes: number;
  extractionStatus: ExtractionStatus;
  extractionError: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationItem {
  _id: string;
  user: string;
  document: { _id: string; name: string; fileType: FileType } | string;
  question: string;
  answer: string;
  status: 'success' | 'failed';
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface DashboardStats {
  totalDocuments: number;
  totalQuestions: number;
  failedExtractions: number;
  recentUploads: DocumentItem[];
  recentConversations: ConversationItem[];
}
