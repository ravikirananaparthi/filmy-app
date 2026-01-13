import { unifiedSearch, type UnifiedSearchResponse } from '@/src/services/api/search.service';
import { useInfiniteQuery } from '@tanstack/react-query';

interface UseUnifiedSearchOptions {
    limit?: number;
}

/**
 * Hook for unified search with cursor-based pagination
 * Returns actresses on first page, then only images on subsequent pages
 */
export function useUnifiedSearch(query: string, options: UseUnifiedSearchOptions = {}) {
    const { limit = 20 } = options;
    const trimmedQuery = query.trim();

    return useInfiniteQuery({
        queryKey: ['search', 'unified', trimmedQuery, { limit }],
        queryFn: async ({ pageParam }) => {
            return await unifiedSearch({
                q: trimmedQuery,
                limit,
                cursor: pageParam,
            });
        },
        getNextPageParam: (lastPage: UnifiedSearchResponse) => {
            if (lastPage.data?.pagination?.hasNextPage && lastPage.data?.pagination?.nextCursor) {
                return lastPage.data.pagination.nextCursor;
            }
            return undefined;
        },
        initialPageParam: undefined as string | undefined,
        enabled: trimmedQuery.length >= 2,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });
}

/**
 * Helper to flatten search pages into single arrays
 */
export const flattenSearchPages = (data: any) => {
    if (!data?.pages) return { actresses: [], images: [] };

    // Actresses only come from first page
    const actresses = data.pages[0]?.data?.actresses || [];

    // Images come from all pages
    const images = data.pages.flatMap((page: any) => page.data?.images || []);

    return { actresses, images };
};

// Keep old hook for backward compatibility
export function useActressSearch(query: string, enabled: boolean = true) {
    const result = useUnifiedSearch(query, { limit: 30 });

    // Transform to match old interface
    return {
        ...result,
        data: result.data ? {
            data: result.data.pages[0]?.data?.actresses || [],
            pagination: result.data.pages[0]?.data?.pagination,
        } : undefined,
    };
}
