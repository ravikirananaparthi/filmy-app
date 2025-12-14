import type { Actress, ActressProfile } from '@types/actress.types';
import type { ActressListParams, ApiResponse, ImageFilterParams, PaginatedApiResponse, PaginationParams, SearchParams } from '@types/api.types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';

// Get actress list
export const getActressList = async (params: ActressListParams = {}) => {
    const response = await apiClient.get<PaginatedApiResponse<Actress>>(
        API_ENDPOINTS.ACTRESSES.LIST,
        { params }
    );
    return response.data;
};

// Search actresses
export const searchActresses = async (params: SearchParams) => {
    const response = await apiClient.get<PaginatedApiResponse<Actress>>(
        API_ENDPOINTS.ACTRESSES.SEARCH,
        { params }
    );
    return response.data;
};

// Get actress profile
export const getActressProfile = async (
    id: string,
    params?: PaginationParams & ImageFilterParams
) => {
    const response = await apiClient.get<ApiResponse<ActressProfile>>(
        API_ENDPOINTS.ACTRESSES.DETAIL(id),
        { params }
    );
    return response.data;
};
