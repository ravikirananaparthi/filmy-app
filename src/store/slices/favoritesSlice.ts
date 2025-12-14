import { create } from 'zustand';

interface FavoritesState {
    favoriteImageIds: Set<string>;
    favoriteActressIds: Set<string>;

    toggleImageFavorite: (id: string) => void;
    toggleActressFavorite: (id: string) => void;
    isImageFavorited: (id: string) => boolean;
    isActressFavorited: (id: string) => boolean;

    setFavoriteImages: (ids: string[]) => void;
    setFavoriteActresses: (ids: string[]) => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
    favoriteImageIds: new Set<string>(),
    favoriteActressIds: new Set<string>(),

    toggleImageFavorite: (id) => set((state) => {
        const newFavorites = new Set(state.favoriteImageIds);
        if (newFavorites.has(id)) {
            newFavorites.delete(id);
        } else {
            newFavorites.add(id);
        }
        return { favoriteImageIds: newFavorites };
    }),

    toggleActressFavorite: (id) => set((state) => {
        const newFavorites = new Set(state.favoriteActressIds);
        if (newFavorites.has(id)) {
            newFavorites.delete(id);
        } else {
            newFavorites.add(id);
        }
        return { favoriteActressIds: newFavorites };
    }),

    isImageFavorited: (id) => get().favoriteImageIds.has(id),
    isActressFavorited: (id) => get().favoriteActressIds.has(id),

    setFavoriteImages: (ids) => set({ favoriteImageIds: new Set(ids) }),
    setFavoriteActresses: (ids) => set({ favoriteActressIds: new Set(ids) }),
}));
