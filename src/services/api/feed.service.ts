import type { ApiResponse, DefaultFeedApiResponse, FeedParams, ForYouFeedApiResponse, PaginatedApiResponse } from '@types/api.types';
import type { Image } from '@types/image.types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';

// Get default feed
export const getDefaultFeed = async (params: FeedParams = {}) => {
    const response = await apiClient.get<DefaultFeedApiResponse>(
        API_ENDPOINTS.FEED.DEFAULT,
        { params }
    );

    // Backend returns { data: { images: [], pagination: {} } }
    // Transform to match PaginatedApiResponse structure
    return {
        success: response.data.success,
        data: response.data.data.images,
        pagination: response.data.data.pagination,
    };
};

// Get For You Feed (personalized with cursor pagination)
export const getForYouFeed = async (params: { limit?: number; cursor?: string } = {}) => {
    const response = await apiClient.get<ForYouFeedApiResponse>(
        API_ENDPOINTS.FEED.FOR_YOU,
        {
            params,
            headers: {
                // Force fresh response, no cache
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        }
    );

    // Safely access nested data with fallbacks
    const responseData = response.data;
    const images = responseData.data?.images || [];
    const pagination = responseData.data?.pagination || { limit: 20, hasNextPage: false };

    return {
        success: responseData.success,
        data: images,
        pagination: pagination,
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
