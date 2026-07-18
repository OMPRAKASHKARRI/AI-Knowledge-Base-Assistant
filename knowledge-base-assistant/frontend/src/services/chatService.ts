import api from './api';
import type { ApiResponse, ConversationItem, Pagination } from '../types';

export const askQuestion = (documentId: string, question: string) =>
  api.post<ApiResponse<{ conversation: ConversationItem }>>('/ask', { documentId, question });

export const getHistory = (page = 1, limit = 10, search = '', documentId = '') =>
  api.get<ApiResponse<{ conversations: ConversationItem[]; pagination: Pagination }>>('/history', {
    params: { page, limit, search: search || undefined, documentId: documentId || undefined },
  });
