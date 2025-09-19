import axios from 'axios';
import { AuthResponse, LoginCredentials, RegisterData, ApiResponse, Dashboard, DataSource, Chart, PaginatedResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getMe: async (): Promise<ApiResponse> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (userData: Partial<RegisterData>): Promise<ApiResponse> => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<ApiResponse> => {
    const response = await api.put('/auth/change-password', data);
    return response.data;
  },
};

export const dataService = {
  uploadFile: async (file: File, name: string, description?: string, isPublic?: boolean): Promise<ApiResponse<DataSource>> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    if (description) formData.append('description', description);
    if (isPublic) formData.append('isPublic', 'true');

    const response = await api.post('/data/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getDataSources: async (page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<DataSource>>> => {
    const response = await api.get(`/data?page=${page}&limit=${limit}`);
    return response.data;
  },

  getDataSource: async (id: string): Promise<ApiResponse<{ dataSource: DataSource }>> => {
    const response = await api.get(`/data/${id}`);
    return response.data;
  },

  getDataSourceData: async (id: string, page: number = 1, limit: number = 100, transform?: string): Promise<ApiResponse> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (transform) params.append('transform', transform);
    
    const response = await api.get(`/data/${id}/data?${params}`);
    return response.data;
  },

  updateDataSource: async (id: string, data: Partial<DataSource>): Promise<ApiResponse<{ dataSource: DataSource }>> => {
    const response = await api.put(`/data/${id}`, data);
    return response.data;
  },

  deleteDataSource: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/data/${id}`);
    return response.data;
  },

  getPublicDataSources: async (page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<DataSource>>> => {
    const response = await api.get(`/data/public?page=${page}&limit=${limit}`);
    return response.data;
  },
};

export const dashboardService = {
  create: async (data: { title: string; description?: string; isPublic?: boolean }): Promise<ApiResponse<{ dashboard: Dashboard }>> => {
    const response = await api.post('/dashboards', data);
    return response.data;
  },

  getAll: async (page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<Dashboard>>> => {
    const response = await api.get(`/dashboards?page=${page}&limit=${limit}`);
    return response.data;
  },

  getById: async (id: string, includeCharts?: boolean): Promise<ApiResponse<{ dashboard: Dashboard; charts?: Chart[]; permission: string }>> => {
    const params = includeCharts ? '?include=charts' : '';
    const response = await api.get(`/dashboards/${id}${params}`);
    return response.data;
  },

  update: async (id: string, data: Partial<Dashboard>): Promise<ApiResponse<{ dashboard: Dashboard }>> => {
    const response = await api.put(`/dashboards/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/dashboards/${id}`);
    return response.data;
  },

  duplicate: async (id: string): Promise<ApiResponse<{ dashboard: Dashboard; charts: Chart[] }>> => {
    const response = await api.post(`/dashboards/${id}/duplicate`);
    return response.data;
  },

  share: async (id: string, email: string, permission: 'view' | 'edit' = 'view'): Promise<ApiResponse> => {
    const response = await api.post(`/dashboards/${id}/share`, { email, permission });
    return response.data;
  },

  getShares: async (id: string): Promise<ApiResponse<{ shares: any[] }>> => {
    const response = await api.get(`/dashboards/${id}/shares`);
    return response.data;
  },

  removeShare: async (id: string, userId: string): Promise<ApiResponse> => {
    const response = await api.delete(`/dashboards/${id}/shares/${userId}`);
    return response.data;
  },

  getPublic: async (page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<Dashboard>>> => {
    const response = await api.get(`/dashboards/public?page=${page}&limit=${limit}`);
    return response.data;
  },

  getShared: async (page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<Dashboard>>> => {
    const response = await api.get(`/dashboards/shared?page=${page}&limit=${limit}`);
    return response.data;
  },
};

export const chartService = {
  create: async (data: Omit<Chart, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<{ chart: Chart }>> => {
    const response = await api.post('/charts', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Chart>): Promise<ApiResponse<{ chart: Chart }>> => {
    const response = await api.put(`/charts/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/charts/${id}`);
    return response.data;
  },

  getData: async (id: string, filters?: Record<string, any>): Promise<ApiResponse> => {
    const params = filters ? `?filters=${encodeURIComponent(JSON.stringify(filters))}` : '';
    const response = await api.get(`/charts/${id}/data${params}`);
    return response.data;
  },

  bulkUpdatePositions: async (updates: Array<{ id: string; position: any }>): Promise<ApiResponse> => {
    const response = await api.put('/charts/bulk-positions', { updates });
    return response.data;
  },
};

export const exportService = {
  exportDashboard: async (dashboardId: string, format: 'pdf' | 'png', config?: any): Promise<Blob> => {
    const response = await api.post(`/export/dashboard/${dashboardId}`, { format, ...config }, {
      responseType: 'blob'
    });
    return response.data;
  },

  exportChart: async (chartId: string, format: 'pdf' | 'png' | 'csv', config?: any): Promise<Blob> => {
    const response = await api.post(`/export/chart/${chartId}`, { format, ...config }, {
      responseType: 'blob'
    });
    return response.data;
  },
};

export default api;