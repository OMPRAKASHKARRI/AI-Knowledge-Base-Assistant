import api from './api';
import type { ApiResponse, DocumentItem, Pagination } from '../types';

export const uploadDocument = (file: File, name: string, onProgress?: (pct: number) => void) => {
  const formData = new FormData();
  formData.append('file', file);
  if (name) formData.append('name', name);

  return api.post<ApiResponse<{ document: DocumentItem }>>('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (onProgress && event.total) {
        onProgress(Math.round((event.loaded * 100) / event.total));
      }
    },
  });
};

export const getDocuments = (page = 1, limit = 10, search = '') =>
  api.get<ApiResponse<{ documents: DocumentItem[]; pagination: Pagination }>>('/documents', {
    params: { page, limit, search: search || undefined },
  });

export const getDocumentById = (id: string) =>
  api.get<ApiResponse<{ document: DocumentItem }>>(`/documents/${id}`);

export const previewDocument = (id: string) =>
  api.get<ApiResponse<{ name: string; fileType: string; preview: string; truncated: boolean }>>(
    `/documents/${id}/preview`
  );

export const deleteDocument = (id: string) => api.delete<ApiResponse<null>>(`/documents/${id}`);
