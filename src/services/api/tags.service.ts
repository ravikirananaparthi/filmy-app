import type { ApiResponse } from './client';
import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';

export interface Tag {
    id: string;
    name: string;
    category: string;
    usage_count: number;
}

export interface PopularTagsResponse {
    tags: Tag[];
    grouped?: Record<string, Tag[]>;
}

export const getPopularTags = async (): Promise<Tag[]> => {
    const response = await apiClient.get<ApiResponse<PopularTagsResponse>>(
        API_ENDPOINTS.TAGS.POPULAR
    );
    // Handle both flat list and grouped responses
    const data = response.data.data;
    if (Array.isArray(data)) return data;
    if (data?.tags) return data.tags;
    if (data?.grouped) return Object.values(data.grouped).flat();
    return [];
};

export const getDiscoverImages = async (params: {
    limit?: number;
    cursor?: string;
} = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.FEED.MAGIC_SHUFFLE, {
        params: { limit: params.limit ?? 20 },
    });
    const d = response.data;
    // magic-shuffle may return { success, data: Image[] } (non-paginated)
    // Normalise to paginated shape for infinite query
    const images = Array.isArray(d?.data) ? d.data : (d?.data?.images ?? []);
    return {
        data: images,
        pagination: {
            hasNextPage: images.length >= (params.limit ?? 20),
            nextCursor: images.length > 0 ? images[images.length - 1]?.id : undefined,
        },
    };
};
