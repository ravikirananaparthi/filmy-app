import { getActressProfile } from '@services/api/actress.service';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { ActressProfileResponse } from 'src/types/actress.types';

export type SortOption = 'popularity' | 'recent' | 'hotness';

interface UseActressProfileOptions {
    sortBy?: SortOption;
    minHotness?: number;
    tags?: string[];
    enabled?: boolean; // For lazy loading - only fetch when true
}

export function useActressProfile(
    actressId: string,
    options: UseActressProfileOptions = {}
) {
    const { sortBy = 'popularity', minHotness, tags, enabled = true } = options;

    return useInfiniteQuery({
        queryKey: ['actress-profile', actressId, { sortBy, minHotness, tags }],
        queryFn: async ({ pageParam = 1 }) => {
            const params: Record<string, any> = {
                page: pageParam,
                limit: 20,
                sortBy,
            };

            if (minHotness) {
                params.minHotness = minHotness;
            }

            if (tags && tags.length > 0) {
                params.tags = tags.join(',');
            }

            const response = await getActressProfile(actressId, params);

            // Handle API response - extract data from success response
            if (response.success && 'data' in response) {
                return response.data as unknown as ActressProfileResponse;
            }

            throw new Error('Failed to fetch actress profile');
        },
        getNextPageParam: (lastPage) => {
            if (lastPage?.pagination?.hasNextPage) {
                return (lastPage.pagination.page || 1) + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
        enabled: !!actressId && enabled, // Only fetch when enabled and has actressId
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
