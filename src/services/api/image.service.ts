import type { Image, ImageDetail } from '@/src/types/image.types';
import { apiClient, type ApiResponse } from './client';
import { API_ENDPOINTS } from './endpoints';

// Get image details
export const getImageDetail = async (id: string): Promise<ImageDetail> => {
    const response = await apiClient.get<ApiResponse<{ image: ImageDetail }>>(
        API_ENDPOINTS.IMAGES.DETAIL(id)
    );
    return response.data.data.image;
};

// Get related images for detail page
export const getRelatedImages = async (id: string): Promise<Image[]> => {
    const response = await apiClient.get<ApiResponse<{ images: Image[] }>>(
        API_ENDPOINTS.IMAGES.RELATED(id)
    );
    return response.data.data?.images ?? [];
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
