import { getForYouFeed } from '@services/api/feed.service';
import { useInfiniteQuery } from '@tanstack/react-query';

interface UseForYouFeedOptions {
    limit?: number;
}

export const useForYouFeed = (options: UseForYouFeedOptions = {}) => {
    const { limit = 20 } = options;

    return useInfiniteQuery({
        queryKey: ['feed', 'for-you', { limit }],
        queryFn: async ({ pageParam }) => {
            // Stringify the cursor object for the API
            const cursor = pageParam ? JSON.stringify(pageParam) : undefined;
            return await getForYouFeed({ limit, cursor });
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.pagination?.hasNextPage && lastPage.pagination?.nextCursor) {
                return lastPage.pagination.nextCursor;
            }
            return undefined;
        },
        initialPageParam: undefined as { score: number; id: string } | undefined,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};

// Helper to flatten pages into single array
export const flattenForYouPages = (data: any) => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page: any) => page.data || []);
};
