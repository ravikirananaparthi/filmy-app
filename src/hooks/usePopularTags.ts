import { apiClient } from '@services/api/client';
import { API_ENDPOINTS } from '@services/api/endpoints';
import { useQuery } from '@tanstack/react-query';

interface Tag {
    id: string;
    name: string;
    category?: string;
    usage_count: number;
}

export const usePopularTags = (limit: number = 20) => {
    return useQuery({
        queryKey: ['tags', 'popular', limit],
        queryFn: async () => {
            const response = await apiClient.get(API_ENDPOINTS.TAGS.POPULAR, {
                params: { limit },
            });
            return response.data.data as Tag[];
        },
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
};

export default usePopularTags;
