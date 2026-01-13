import { getFavoritesPreview } from '@/src/services/api/favorites.service';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook for fetching favorites preview (5 liked + 5 saved thumbnails)
 */
export function useFavoritesPreview() {
    return useQuery({
        queryKey: ['favorites', 'preview'],
        queryFn: async () => {
            const response = await getFavoritesPreview();
            return response.data;
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });
}
