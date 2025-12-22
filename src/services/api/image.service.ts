import type { ApiResponse } from '@types/api.types';
import type { ImageDetail } from '@types/image.types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';

// Get image details
export const getImageDetail = async (id: string) => {
    const response = await apiClient.get<ApiResponse<ImageDetail>>(
        API_ENDPOINTS.IMAGES.DETAIL(id)
    );
    return response.data;
};

// Like image
export const likeImage = async (id: string) => {       
    const response = await apiClient.post<ApiResponse>(
        API_ENDPOINTS.IMAGES.LIKE(id)
    );
    return response.data;
};

// Unlike image
export const unlikeImage = async (id: string) => {
    const response = await apiClient.delete<ApiResponse>(
        API_ENDPOINTS.IMAGES.UNLIKE(id)
    );
    return response.data;
};

// Download image
export const downloadImage = async (id: string) => {
    const response = await apiClient.post<ApiResponse>(
        API_ENDPOINTS.IMAGES.DOWNLOAD(id)
    );
    return response.data;
};

// Set as wallpaper
export const setWallpaper = async (id: string) => {
    const response = await apiClient.post<ApiResponse>(
        API_ENDPOINTS.IMAGES.WALLPAPER(id)
    );
    return response.data;
};
