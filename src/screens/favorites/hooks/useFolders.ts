import { getFolders } from '@/src/services/api/favorites.service';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook for fetching user's folders
 */
export function useFolders() {
    return useQuery({
        queryKey: ['favorites', 'folders'],
        queryFn: async () => {
            const response = await getFolders();
            return response.data.folders;
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });
}
