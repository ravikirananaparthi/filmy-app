import { create } from 'zustand';

export type SortOption = 'popularity' | 'recent' | 'hotness';

interface FilterState {
    selectedTags: string[];
    minHotness: number | undefined;
    maxHotness: number | undefined;
    sortBy: SortOption;

    // Actions
    toggleTag: (tag: string) => void;
    setTags: (tags: string[]) => void;
    setHotnessRange: (min?: number, max?: number) => void;
    setSortBy: (sort: SortOption) => void;
    clearFilters: () => void;
}

export const useFilters = create<FilterState>((set) => ({
    selectedTags: [],
    minHotness: undefined,
    maxHotness: undefined,
    sortBy: 'popularity',

    toggleTag: (tag) =>
        set((state) => ({
            selectedTags: state.selectedTags.includes(tag)
                ? state.selectedTags.filter((t) => t !== tag)
                : [...state.selectedTags, tag],
        })),

    setTags: (tags) => set({ selectedTags: tags }),

    setHotnessRange: (min, max) =>
        set({ minHotness: min, maxHotness: max }),

    setSortBy: (sort) => set({ sortBy: sort }),

    clearFilters: () =>
        set({
            selectedTags: [],
            minHotness: undefined,
            maxHotness: undefined,
            sortBy: 'popularity',
        }),
}));

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'recent', label: 'Most Recent' },
    { value: 'hotness', label: 'Hotness Rating' },
];
