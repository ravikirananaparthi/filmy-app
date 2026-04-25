import { useInfiniteQuery } from '@tanstack/react-query';
import { getUserUploads } from '@services/api/user.service';

export const userUploadsKeys = {
    uploads: ['userUploads'] as const,
};

export function useUserUploads() {
    return useInfiniteQuery({
        queryKey: userUploadsKeys.uploads,
        queryFn: ({ pageParam }) =>
            getUserUploads({ limit: 20, cursor: pageParam as string | undefined }),
        getNextPageParam: (lastPage) =>
            lastPage.pagination.hasNextPage ? lastPage.pagination.nextCursor ?? undefined : undefined,
        initialPageParam: undefined as string | undefined,
        staleTime: 2 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
    });
}
