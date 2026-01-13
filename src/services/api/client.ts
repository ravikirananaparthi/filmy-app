import { ENV } from '@config/env';
import axios, { AxiosInstance } from 'axios';

// Conditionally import Reactotron only in development
const Reactotron = __DEV__ ? require('@config/reactotron').default : null;

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: ENV.API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',// change it later before prod release
        // DO NOT include Accept-Encoding - React Native can't decompress br/gzip
    },
    // Ensure automatic JSON parsing
    responseType: 'json',
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
    (config) => {
        // For development, use hardcoded token
        const token = ENV.DEV_AUTH_TOKEN;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log to Reactotron in development
        if (__DEV__ && Reactotron.display) {
            Reactotron.display({
                name: '🚀 API REQUEST',
                preview: `${config.method?.toUpperCase()} ${config.url}`,
                value: {
                    url: config.url,
                    baseURL: config.baseURL,
                    method: config.method,
                    headers: config.headers,
                    params: config.params,
                    data: config.data,
                },
            });
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
    (response) => {
        // Log successful responses in development for debugging
        if (ENV.IS_DEV) {


            // Log to Reactotron with properly formatted JSON
            if (Reactotron?.display) {
                Reactotron.display({
                    name: '✅ API RESPONSE',
                    preview: `${response.status} ${response.config?.url}`,
                    value: {
                        url: response.config?.url,
                        method: response.config?.method,
                        status: response.status,
                        statusText: response.statusText,
                        contentType: response.headers?.['content-type'],
                        data: response.data, // ✅ This will be properly decompressed JSON!
                    },
                    important: true,
                });
            }
        }
        return response;
    },
    (error) => {
        // Log errors in development
        if (ENV.IS_DEV) {

            // Log to Reactotron
            if (Reactotron?.display) {
                Reactotron.display({
                    name: '❌ API ERROR',
                    preview: `${error.response?.status || 'Network Error'} - ${error.message}`,
                    value: {
                        message: error.message,
                        url: error.config?.url,
                        method: error.config?.method,
                        status: error.response?.status,
                        statusText: error.response?.statusText,
                        data: error.response?.data,
                        headers: error.response?.headers,
                    },
                    important: true,
                });
            }
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
