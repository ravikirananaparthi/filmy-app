import {
    getFeaturedActresses,
    getHighlights
} from '@/src/services/api/explore.service';
import { useQuery } from '@tanstack/react-query';

// Query keys for cache management
export const exploreKeys = {
    all: ['explore'] as const,
    highlights: () => [...exploreKeys.all, 'highlights'] as const,
    featuredActresses: () => [...exploreKeys.all, 'featured-actresses'] as const,
};

/**
 * Hook to fetch highlight images for the Explore screen carousel.
 * Data is cached and doesn't refetch too frequently.
 */
export function useHighlights() {
    return useQuery({
        queryKey: exploreKeys.highlights(),
        queryFn: getHighlights,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
    });
}

/**
 * Hook to fetch featured actresses for the Explore screen.
 * Data is cached and doesn't refetch too frequently.
 */
export function useFeaturedActresses() {
    return useQuery({
        queryKey: exploreKeys.featuredActresses(),
        queryFn: getFeaturedActresses,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
    });
}
