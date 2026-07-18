import api from './api';
import type { ApiResponse, User } from '../types';

interface AuthPayload {
  user: User;
  token: string;
}

export const signup = (name: string, email: string, password: string) =>
  api.post<ApiResponse<AuthPayload>>('/auth/signup', { name, email, password });

export const login = (email: string, password: string) =>
  api.post<ApiResponse<AuthPayload>>('/auth/login', { email, password });

export const getMe = () => api.get<ApiResponse<{ user: User }>>('/auth/me');
