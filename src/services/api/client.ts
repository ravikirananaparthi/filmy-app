import { ENV } from '@config/env';
import axios, { AxiosInstance } from 'axios';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: ENV.API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
    (config) => {
        // For development, use hardcoded token
        const token = ENV.DEV_AUTH_TOKEN;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Log errors in development
        if (ENV.IS_DEV) {
            console.error('API Error:', error.response?.data || error.message);
        }

        return Promise.reject(error);
    }
);

export { apiClient };

// Helper types for API responses
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data: T;
}

export interface PaginatedResponse<T = any> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}
