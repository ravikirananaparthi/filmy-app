import type { ApiResponse } from './client';
import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';

// Types for Explore API responses
export interface HighlightImage {
    id: string;
    imageUrl: string;
    thumbnailUrl: string;
    hotnessRating: number;
    likesCount: number;
    position: number;
    actress: {
        id: string;
        name: string;
        coverImageUrl: string;
    };
}

export interface HighlightsResponse {
    isCurated: boolean;
    images: HighlightImage[];
}

export interface FeaturedActress {
    id: string;
    name: string;
    coverImageUrl: string;
    popularityRating: number;
    position: number;
}

export interface FeaturedActressesResponse {
    isCurated: boolean;
    actresses: FeaturedActress[];
}

/**
 * Get top 10 highlight images with actress details.
 * Public endpoint, no auth required.
 */
export const getHighlights = async (): Promise<HighlightsResponse> => {
    const response = await apiClient.get<ApiResponse<HighlightsResponse>>(
        API_ENDPOINTS.EXPLORE.HIGHLIGHTS
    );
    return response.data.data;
};

/**
 * Get top 10 featured actress profiles.
 * Public endpoint, no auth required.
 */
export const getFeaturedActresses = async (): Promise<FeaturedActressesResponse> => {
    const response = await apiClient.get<ApiResponse<FeaturedActressesResponse>>(
        API_ENDPOINTS.EXPLORE.FEATURED_ACTRESSES
    );
    return response.data.data;
};
