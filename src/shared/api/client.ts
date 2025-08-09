import axios from 'axios';

// Prefer explicit env; in local dev default to backend at http://localhost:8000
const ENV_BASE = (import.meta as any).env?.VITE_API_URL as string | undefined;
const isLocalDev = typeof window !== 'undefined' && window.location?.port === '3000';
const API_BASE_URL = ENV_BASE ?? (isLocalDev ? 'http://localhost:8000' : '');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default apiClient;