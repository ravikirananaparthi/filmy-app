import type { ApiResponse, FeedParams, PaginatedApiResponse } from '@types/api.types';
import type { Image } from '@types/image.types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';

// Get default feed
export const getDefaultFeed = async (params: FeedParams = {}) => {
    const response = await apiClient.get<any>(
        API_ENDPOINTS.FEED.DEFAULT,
        { params }
    );

    // API returns { success, message, data: { images: [], pagination: {} } }
    // Transform to match expected format
    return {
        success: response.data.success,
        data: response.data.data.images || [],
        pagination: response.data.data.pagination || {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
        },
    };
};

// Get magic shuffle feed
export const getMagicShuffle = async (limit: number = 20) => {
    const response = await apiClient.get<ApiResponse<Image[]>>(
        API_ENDPOINTS.FEED.MAGIC_SHUFFLE,
        { params: { limit } }
    );
    return response.data;
};

// Get blend feed
export const getBlendFeed = async (params: FeedParams = {}) => {
    const response = await apiClient.get<PaginatedApiResponse<Image>>(
        API_ENDPOINTS.FEED.BLEND,
        { params }
    );
    return response.data;
};

// Custom blend
export const getCustomBlend = async (data: {
    actressIds: string[];
    page?: number;
    limit?: number;
    tags?: string[];
    minHotness?: number;
    maxHotness?: number;
}) => {
    const response = await apiClient.post<PaginatedApiResponse<Image>>(
        API_ENDPOINTS.FEED.CUSTOM_BLEND,
        data
    );
    return response.data;
};
