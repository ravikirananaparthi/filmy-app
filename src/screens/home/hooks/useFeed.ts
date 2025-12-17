import type { FeedParams } from '@/src/types/api.types';
import { getDefaultFeed } from '@services/api/feed.service';
import { useInfiniteQuery } from '@tanstack/react-query';

interface UseFeedOptions {
    tags?: string[];
    minHotness?: number;
    maxHotness?: number;
    sortBy?: 'popularity' | 'recent' | 'hotness';
    limit?: number;
}

export const useFeed = (options: UseFeedOptions = {}) => {
    const { tags, minHotness, maxHotness, sortBy, limit = 20 } = options;

    return useInfiniteQuery({
        queryKey: ['feed', 'default', { tags, minHotness, maxHotness, sortBy }],
        queryFn: async ({ pageParam = 1 }) => {
            const params: FeedParams = {
                page: pageParam,
                limit,
            };

            if (tags && tags.length > 0) {
                params.tags = tags;
            }
            if (minHotness !== undefined) {
                params.minHotness = minHotness;
            }
            if (maxHotness !== undefined) {
                params.maxHotness = maxHotness;
            }
            if (sortBy) {
                params.sortBy = sortBy;
            }

            try {
                return await getDefaultFeed(params);
            } catch (error: any) {
                console.error('Feed fetch error:', error.message);
                // Re-throw to let TanStack Query handle retries and error state
                throw error;
            }
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.pagination?.hasNextPage) {
                return lastPage.pagination.page + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes
        retry: 3, // Retry failed requests 3 times
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    });
};

// Helper to flatten pages into single array
export const flattenFeedPages = (data: any) => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page: any) => page.data || []);
};
