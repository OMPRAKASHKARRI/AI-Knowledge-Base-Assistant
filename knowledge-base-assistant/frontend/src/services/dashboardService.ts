import api from './api';
import type { ApiResponse, DashboardStats } from '../types';

export const getDashboardStats = () => api.get<ApiResponse<DashboardStats>>('/dashboard');
