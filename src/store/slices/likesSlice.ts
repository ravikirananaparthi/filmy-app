import { create } from 'zustand';

interface LikesState {
    // Map of imageId -> local liked status (what UI shows)
    likedImages: Map<string, boolean>;
    // Map of imageId -> server's known state (last synced)
    serverLikedImages: Map<string, boolean>;

    // Actions
    setLiked: (imageId: string, isLiked: boolean) => void;
    toggleLike: (imageId: string) => void;
    isLiked: (imageId: string) => boolean;

    // Server state management
    getServerState: (imageId: string) => boolean;
    setServerState: (imageId: string, isLiked: boolean) => void;

    // Initialize from API data
    initFromApiData: (images: Array<{ id: string; isUserLiked?: boolean }>) => void;
}

/**
 * Zustand store for like state - single source of truth
 * 
 * Instagram/Pinterest-style optimistic updates:
 * 1. likedImages tracks what the UI shows (instant updates)
 * 2. serverLikedImages tracks what the server knows (for sync comparison)
 * 3. No pending states - UI never shows loading
 */
export const useLikesStore = create<LikesState>((set, get) => ({
    likedImages: new Map<string, boolean>(),
    serverLikedImages: new Map<string, boolean>(),

    setLiked: (imageId, isLiked) => set((state) => {
        const newMap = new Map(state.likedImages);
        newMap.set(imageId, isLiked);
        return { likedImages: newMap };
    }),

    toggleLike: (imageId) => set((state) => {
        const newMap = new Map(state.likedImages);
        const currentValue = newMap.get(imageId) || false;
        newMap.set(imageId, !currentValue);
        return { likedImages: newMap };
    }),

    isLiked: (imageId) => get().likedImages.get(imageId) || false,

    getServerState: (imageId) => get().serverLikedImages.get(imageId) || false,

    setServerState: (imageId, isLiked) => set((state) => {
        const newMap = new Map(state.serverLikedImages);
        newMap.set(imageId, isLiked);
        return { serverLikedImages: newMap };
    }),

    initFromApiData: (images) => set((state) => {
        const newLikedMap = new Map(state.likedImages);
        const newServerMap = new Map(state.serverLikedImages);

        for (const image of images) {
            const isLiked = image.isUserLiked || false;
            // Only set if not already in store (preserve local optimistic state)
            if (!newLikedMap.has(image.id)) {
                newLikedMap.set(image.id, isLiked);
            }
            // Always update server state from API
            newServerMap.set(image.id, isLiked);
        }

        return {
            likedImages: newLikedMap,
            serverLikedImages: newServerMap,
        };
    }),
}));

export default useLikesStore;
