import { getLikedImages, type LikedImage } from '@/src/services/api/likes.service';
import { useInfiniteQuery } from '@tanstack/react-query';

interface UseLikedImagesOptions {
    limit?: number;
}

/**
 * Hook for fetching liked images with cursor pagination
 */
export function useLikedImages(options: UseLikedImagesOptions = {}) {
    const { limit = 20 } = options;

    return useInfiniteQuery({
        queryKey: ['likes', 'images', { limit }],
        queryFn: async ({ pageParam }) => {
            return await getLikedImages({
                limit,
                cursor: pageParam,
            });
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.data?.pagination?.hasNextPage && lastPage.data?.pagination?.nextCursor) {
                return lastPage.data.pagination.nextCursor;
            }
            return undefined;
        },
        initialPageParam: undefined as string | undefined,
        staleTime: 1000 * 60 * 2, // 2 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });
}

/**
 * Helper to flatten liked images pages
 */
export const flattenLikedPages = (data: any): LikedImage[] => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page: any) => page.data?.images || []);
};
