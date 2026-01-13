import { getAutocompleteSuggestions, type AutocompleteSuggestion } from '@/src/services/api/search.service';
import { useQuery } from '@tanstack/react-query';

interface UseAutocompleteOptions {
    limit?: number;
    enabled?: boolean;
}

/**
 * Hook for getting autocomplete suggestions as user types
 * Only triggers when query is 2+ characters
 */
export function useAutocomplete(query: string, options: UseAutocompleteOptions = {}) {
    const { limit = 5, enabled = true } = options;
    const trimmedQuery = query.trim();

    return useQuery({
        queryKey: ['search', 'autocomplete', trimmedQuery, { limit }],
        queryFn: async () => {
            const response = await getAutocompleteSuggestions(trimmedQuery, limit);
            return response.data?.suggestions || [];
        },
        enabled: enabled && trimmedQuery.length >= 2,
        staleTime: 1000 * 60 * 2, // 2 minutes
        gcTime: 1000 * 60 * 5, // 5 minutes
    });
}

export type { AutocompleteSuggestion };
