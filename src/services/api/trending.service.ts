import type { ApiResponse } from '@types/api.types';
import type { Image } from '@types/image.types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';

// Get trending images
export const getTrendingImages = async () => {
    const response = await apiClient.get<ApiResponse<Image[]>>(
        API_ENDPOINTS.TRENDING.IMAGES
    );
    return response.data;
};
