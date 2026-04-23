import { ENV } from '@config/env';
import { authService } from '@services/auth.service';
import { useAuthStore } from '@store/slices/authSlice';
import axios, { AxiosInstance } from 'axios';

const Reactotron = __DEV__ ? require('@config/reactotron').default : null;

const apiClient: AxiosInstance = axios.create({
    baseURL: ENV.API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    responseType: 'json',
});

// Request interceptor — inject token from auth store
apiClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (__DEV__ && Reactotron?.display) {
            Reactotron.display({
                name: '🚀 API REQUEST',
                preview: `${config.method?.toUpperCase()} ${config.url}`,
                value: { url: config.url, method: config.method, headers: config.headers, params: config.params, data: config.data },
            });
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — refresh token on 401, log in dev
apiClient.interceptors.response.use(
    (response) => {
        if (__DEV__ && Reactotron?.display) {
            Reactotron.display({
                name: '✅ API RESPONSE',
                preview: `${response.status} ${response.config?.url}`,
                value: { url: response.config?.url, method: response.config?.method, status: response.status, data: response.data },
                important: true,
            });
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Auto-refresh on 401 (token expired)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newSession = await authService.refreshSession();
                if (newSession) {
                    useAuthStore.getState().setSession(newSession.access_token, newSession.refresh_token);
                    originalRequest.headers.Authorization = `Bearer ${newSession.access_token}`;
                    return apiClient(originalRequest);
                }
            } catch {
                // Refresh failed — logout
                await useAuthStore.getState().logout();
            }
        }

        if (__DEV__ && Reactotron?.display) {
            Reactotron.display({
                name: '❌ API ERROR',
                preview: `${error.response?.status || 'Network Error'} - ${error.message}`,
                value: { message: error.message, url: error.config?.url, status: error.response?.status, data: error.response?.data },
                important: true,
            });
        }

        return Promise.reject(error);
    }
);

export { apiClient };

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
