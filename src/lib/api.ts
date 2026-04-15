import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
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

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; firstName?: string; lastName?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

// Contacts API
export const contactsAPI = {
  list: (params?: { limit?: number; offset?: number; search?: string; relationshipType?: string }) =>
    api.get('/contacts', { params }),
  search: (q: string) =>
    api.get('/contacts/search', { params: { q } }),
  get: (id: string) =>
    api.get(`/contacts/${id}`),
  getTimeline: (id: string) =>
    api.get(`/contacts/${id}/timeline`),
  create: (data: any) =>
    api.post('/contacts', data),
  update: (id: string, data: any) =>
    api.put(`/contacts/${id}`, data),
  delete: (id: string) =>
    api.delete(`/contacts/${id}`),
};

// Integrations API
export const integrationsAPI = {
  list: () =>
    api.get('/integrations'),
  connect: (platform: string) =>
    api.get(`/integrations/${platform}/connect`),
  disconnect: (platform: string) =>
    api.delete(`/integrations/${platform}`),
  sync: (platform: string) =>
    api.post(`/integrations/${platform}/sync`),
};

// Drafts API
export const draftsAPI = {
  list: (status?: string) =>
    api.get('/drafts', { params: { status } }),
  get: (id: string) =>
    api.get(`/drafts/${id}`),
  generate: (data: { contactId: string; originalMessageId?: string; userPrompt?: string; tone?: string }) =>
    api.post('/drafts/generate', data),
  approve: (id: string, edits?: string) =>
    api.put(`/drafts/${id}/approve`, { edits }),
  reject: (id: string, feedback: string) =>
    api.put(`/drafts/${id}/reject`, { feedback }),
  rewrite: (id: string, feedback: string, tone?: string) =>
    api.post(`/drafts/${id}/rewrite`, { feedback, tone }),
  send: (id: string) =>
    api.post(`/drafts/${id}/send`),
  delete: (id: string) =>
    api.delete(`/drafts/${id}`),
};

// Analytics API
export const analyticsAPI = {
  dashboard: (timeRange?: string) =>
    api.get('/analytics/dashboard', { params: { timeRange } }),
  revenue: (timeRange?: string) =>
    api.get('/analytics/revenue', { params: { timeRange } }),
  interactions: (timeRange?: string) =>
    api.get('/analytics/interactions', { params: { timeRange } }),
  growth: (timeRange?: string) =>
    api.get('/analytics/contacts/growth', { params: { timeRange } }),
  marketing: () =>
    api.get('/analytics/marketing'),
};

// Chat API
export const chatAPI = {
  send: (message: string, conversationId?: string) =>
    api.post('/chat', { message, conversationId }),
  history: (conversationId?: string) =>
    api.get('/chat/history', { params: { conversationId } }),
  search: (query: string) =>
    api.post('/chat/search', { query }),
  delete: (conversationId: string) =>
    api.delete(`/chat/${conversationId}`),
};

export default api;
