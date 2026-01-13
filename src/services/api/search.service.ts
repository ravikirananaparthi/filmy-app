import type { Actress } from '@/src/types/actress.types';
import type { Image } from '@/src/types/image.types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';

// ============ Types ============

export interface UnifiedSearchParams {
    q: string;
    limit?: number;
    cursor?: string;
}

export interface UnifiedSearchResponse {
    success: boolean;
    message?: string;
    data: {
        query: string;
        actresses: Actress[];
        images: Image[];
        pagination: {
            limit: number;
            hasNextPage: boolean;
            nextCursor?: string;
        };
    };
}

export interface AutocompleteSuggestion {
    type: 'actress' | 'tag';
    id: string;
    name: string;
    imageUrl?: string; // Only for actress type
}

export interface AutocompleteResponse {
    success: boolean;
    data: {
        suggestions: AutocompleteSuggestion[];
    };
}

export interface RecentSearch {
    id: string;
    query: string;
    searched_at: string;
}

export interface RecentSearchesResponse {
    success: boolean;
    data: {
        searches: RecentSearch[];
    };
}

// ============ API Functions ============

/**
 * Unified search with cursor-based pagination
 * First page returns actresses + images, subsequent pages return only images
 */
export const unifiedSearch = async (params: UnifiedSearchParams): Promise<UnifiedSearchResponse> => {
    const response = await apiClient.get<UnifiedSearchResponse>(
        API_ENDPOINTS.SEARCH.UNIFIED,
        { params }
    );
    return response.data;
};

/**
 * Get autocomplete suggestions as user types
 */
export const getAutocompleteSuggestions = async (q: string, limit: number = 5): Promise<AutocompleteResponse> => {
    const response = await apiClient.get<AutocompleteResponse>(
        API_ENDPOINTS.SEARCH.AUTOCOMPLETE,
        { params: { q, limit } }
    );
    return response.data;
};

/**
 * Get user's recent search history
 */
export const getRecentSearches = async (limit: number = 10): Promise<RecentSearchesResponse> => {
    const response = await apiClient.get<RecentSearchesResponse>(
        API_ENDPOINTS.SEARCH.RECENT,
        { params: { limit } }
    );
    return response.data;
};

/**
 * Save a search to user's history
 */
export const saveRecentSearch = async (query: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post<{ success: boolean; message: string }>(
        API_ENDPOINTS.SEARCH.RECENT,
        { query }
    );
    return response.data;
};

/**
 * Clear all recent searches for user
 */
export const clearRecentSearches = async (): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
        API_ENDPOINTS.SEARCH.RECENT
    );
    return response.data;
};

// ============ Legacy (kept for backward compatibility) ============

// Search actresses (old endpoint - use unifiedSearch instead)
export const searchActresses = async (params: { query: string; limit?: number }) => {
    const response = await apiClient.get<any>(
        API_ENDPOINTS.ACTRESSES.SEARCH,
        { params }
    );
    return response.data;
};
