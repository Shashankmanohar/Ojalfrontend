import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from '@/hooks/use-toast';

// API Response Types
export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: any;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string>;
}

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Check if this is an admin route
    const isAdminRoute = config.url?.includes('/api/admin') ||
      config.url?.includes('/api/products') ||
      config.url?.includes('/api/orders') ||
      config.url?.includes('/api/users');

    // Use admin token for admin routes, otherwise use regular user token
    const token = isAdminRoute
      ? localStorage.getItem('adminToken') || localStorage.getItem('authToken')
      : localStorage.getItem('authToken');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Handle network errors
    if (!error.response) {
      toast({
        title: 'Network Error',
        description: 'Unable to connect to the server. Please check your connection.',
        variant: 'destructive',
      });
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const requestUrl = error.config?.url || '';

    // Handle specific error codes
    switch (status) {
      case 401:
        // Unauthorized - don't redirect on login endpoints (let them handle errors)
        const isLoginEndpoint = requestUrl.includes('/login');
        if (!isLoginEndpoint) {
          // Clear tokens only if not on login page
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/auth' && !window.location.pathname.includes('/admin/login')) {
            toast({
              title: 'Session Expired',
              description: 'Please login again to continue.',
              variant: 'destructive',
            });
            if (window.location.pathname.includes('/admin')) {
              window.location.href = '/admin/login';
            } else {
              window.location.href = '/auth';
            }
          }
        }
        break;

      case 403:
        toast({
          title: 'Access Denied',
          description: data?.message || 'You do not have permission to perform this action.',
          variant: 'destructive',
        });
        break;

      case 404:
        toast({
          title: 'Not Found',
          description: data?.message || 'The requested resource was not found.',
          variant: 'destructive',
        });
        break;

      case 500:
        toast({
          title: 'Server Error',
          description: 'An internal server error occurred. Please try again later.',
          variant: 'destructive',
        });
        break;

      default:
        // Show error message from backend if available
        if (data?.message) {
          toast({
            title: 'Error',
            description: data.message,
            variant: 'destructive',
          });
        }
    }

    return Promise.reject(error);
  }
);

export default api;
