import type { ApiResponse } from './client';
import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';

export interface Tag {
    id: string;
    name: string;
    category: string;
    usage_count: number;
    /** Optional preview thumbnail — enriched by getTagsWithPreviews */
    thumbnailUrl?: string | null;
}

export interface PopularTagsResponse {
    tags: Tag[];
    grouped?: Record<string, Tag[]>;
}

export const getPopularTags = async (): Promise<Tag[]> => {
    const response = await apiClient.get<ApiResponse<PopularTagsResponse>>(
        API_ENDPOINTS.TAGS.POPULAR
    );
    const data = response.data.data;
    if (Array.isArray(data)) return data;
    if (data?.tags) return data.tags;
    if (data?.grouped) return Object.values(data.grouped).flat();
    return [];
};

/**
 * Fetches popular tags enriched with a thumbnail from the hottest matching image.
 * Makes 2 requests in parallel: tags list + top-40 hottest images.
 */
export const getTagsWithPreviews = async (): Promise<Tag[]> => {
    const [tagsResult, imagesResult] = await Promise.allSettled([
        getPopularTags(),
        apiClient.get(API_ENDPOINTS.IMAGES.LIST, {
            params: { limit: 40, sort: 'hotness_rating', order: 'desc' },
        }),
    ]);

    const tags: Tag[] = tagsResult.status === 'fulfilled' ? tagsResult.value.slice(0, 8) : [];

    let hotImages: any[] = [];
    if (imagesResult.status === 'fulfilled') {
        const d = imagesResult.value.data;
        // Handle: { data: { images: [] } }  |  { data: [] }  |  []
        hotImages =
            d?.data?.images ??
            (Array.isArray(d?.data) ? d.data : null) ??
            (Array.isArray(d) ? d : []);
    }

    // Track used image ids so every tag card shows a different thumbnail
    const usedIds = new Set<string>();

    return tags.map((tag) => {
        // 1. Prefer an image explicitly tagged with this tag name
        let match = hotImages.find(
            (img: any) =>
                !usedIds.has(img.id) &&
                img.tags?.some(
                    (t: string) => t.toLowerCase() === tag.name.toLowerCase()
                )
        );

        // 2. Fallback: pick the next unused hot image so cards are always diverse
        if (!match) {
            match = hotImages.find((img: any) => !usedIds.has(img.id));
        }

        if (match) usedIds.add(match.id);
        return { ...tag, thumbnailUrl: match?.thumbnail_url ?? null };
    });
};

/**
 * Infinite discover images.
 * Waterfall: FOR_YOU → MAGIC_SHUFFLE → IMAGES.LIST
 */
export const getDiscoverImages = async (params: {
    limit?: number;
    cursor?: string;
} = {}) => {
    const limit = params.limit ?? 20;

    // 1. FOR_YOU — personalized, cursor-paginated, hotness-sorted
    try {
        const res = await apiClient.get(API_ENDPOINTS.FEED.FOR_YOU, {
            params: { limit, cursor: params.cursor },
        });
        const d = res.data;
        const images: any[] = d?.data?.images ?? (Array.isArray(d?.data) ? d.data : []);
        if (images.length > 0) {
            const pg = d?.data?.pagination;
            return {
                data: images,
                pagination: {
                    hasNextPage: pg?.hasNextPage ?? images.length >= limit,
                    nextCursor: pg?.nextCursor ?? images[images.length - 1]?.id,
                },
            };
        }
    } catch { /* fall through */ }

    // 2. MAGIC_SHUFFLE — shuffled, no cursor
    try {
        const res = await apiClient.get(API_ENDPOINTS.FEED.MAGIC_SHUFFLE, {
            params: { limit },
        });
        const d = res.data;
        const images: any[] = Array.isArray(d?.data) ? d.data : (d?.data?.images ?? []);
        if (images.length > 0) {
            return {
                data: images,
                pagination: {
                    hasNextPage: images.length >= limit,
                    nextCursor: images[images.length - 1]?.id,
                },
            };
        }
    } catch { /* fall through */ }

    // 3. Plain images list sorted by hotness — most reliable fallback
    const res = await apiClient.get(API_ENDPOINTS.IMAGES.LIST, {
        params: { limit, sort: 'hotness_rating', order: 'desc', cursor: params.cursor },
    });
    const d = res.data;
    const images: any[] = d?.data?.images ?? (Array.isArray(d?.data) ? d.data : []);
    return {
        data: images,
        pagination: {
            hasNextPage: images.length >= limit,
            nextCursor: images.length > 0 ? images[images.length - 1]?.id : undefined,
        },
    };
};
