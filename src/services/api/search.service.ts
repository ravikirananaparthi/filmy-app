import type { Actress } from '@types/actress.types';
import type { ImageFilterParams, PaginatedApiResponse, PaginationParams, SearchParams } from '@types/api.types';
import type { Image } from '@types/image.types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';

// Search actresses
export const searchActresses = async (params: SearchParams) => {
    const response = await apiClient.get<PaginatedApiResponse<Actress>>(
        API_ENDPOINTS.ACTRESSES.SEARCH,
        { params }
    );
    return response.data;
};

// Search images (can filter by actress, tags, etc.)
export const searchImages = async (params: PaginationParams & ImageFilterParams & { actressId?: string }) => {
    const response = await apiClient.get<PaginatedApiResponse<Image>>(
        API_ENDPOINTS.IMAGES.LIST,
        { params }
    );
    return response.data;
};
