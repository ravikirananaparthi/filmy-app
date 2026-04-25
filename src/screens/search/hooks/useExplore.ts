import { getDiscoverImages, getPopularTags } from '@services/api/tags.service';
import { getTrendingImages } from '@services/api/trending.service';
import {
    getFeaturedActresses,
    getHighlights,
} from '@services/api/explore.service';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

// ─── Query keys ────────────────────────────────────────────────────────────
export const exploreKeys = {
    all: ['explore'] as const,
    highlights: () => [...exploreKeys.all, 'highlights'] as const,
    featuredActresses: () => [...exploreKeys.all, 'featured-actresses'] as const,
    trendingPreview: () => [...exploreKeys.all, 'trending-preview'] as const,
    popularTags: () => [...exploreKeys.all, 'popular-tags'] as const,
    discover: () => [...exploreKeys.all, 'discover'] as const,
};

export function useHighlights() {
    return useQuery({
        queryKey: exploreKeys.highlights(),
        queryFn: getHighlights,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}

export function useFeaturedActresses() {
    return useQuery({
        queryKey: exploreKeys.featuredActresses(),
        queryFn: getFeaturedActresses,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}

export function useTrendingPreview() {
    return useQuery({
        queryKey: exploreKeys.trendingPreview(),
        queryFn: async () => {
            const res = await getTrendingImages();
            const images = Array.isArray(res?.data) ? res.data : [];
            return images.slice(0, 6);
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}

export function usePopularTags() {
    return useQuery({
        queryKey: exploreKeys.popularTags(),
        queryFn: getPopularTags,
        staleTime: 10 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
    });
}

export function useDiscoverImages() {
    return useInfiniteQuery({
        queryKey: exploreKeys.discover(),
        queryFn: ({ pageParam }) =>
            getDiscoverImages({ limit: 20, cursor: pageParam as string | undefined }),
        getNextPageParam: (lastPage) =>
            lastPage.pagination?.hasNextPage
                ? lastPage.pagination.nextCursor
                : undefined,
        initialPageParam: undefined as string | undefined,
        staleTime: 2 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
    });
}
