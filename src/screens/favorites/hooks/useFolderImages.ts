import { getFolderImages, type FolderImagesResponse } from '@/src/services/api/favorites.service';
import type { Image } from '@/src/types/image.types';
import { useInfiniteQuery } from '@tanstack/react-query';

interface UseFolderImagesOptions {
    limit?: number;
}

/**
 * Hook for fetching images in a specific folder with cursor pagination
 */
export function useFolderImages(folderId: string, options: UseFolderImagesOptions = {}) {
    const { limit = 20 } = options;

    return useInfiniteQuery({
        queryKey: ['favorites', 'folder', folderId, 'images', { limit }],
        queryFn: async ({ pageParam }) => {
            return await getFolderImages(folderId, {
                limit,
                cursor: pageParam,
            });
        },
        getNextPageParam: (lastPage: FolderImagesResponse) => {
            if (lastPage.data?.pagination?.hasNextPage && lastPage.data?.pagination?.nextCursor) {
                return lastPage.data.pagination.nextCursor;
            }
            return undefined;
        },
        initialPageParam: undefined as string | undefined,
        enabled: !!folderId,
        staleTime: 1000 * 60 * 2, // 2 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });
}

/**
 * Helper to flatten folder images pages
 */
export const flattenFolderPages = (data: any): Image[] => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page: any) => page.data?.images || []);
};
