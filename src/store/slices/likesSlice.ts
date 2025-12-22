import { create } from 'zustand';

interface LikesState {
    // Map of imageId -> local liked status (what UI shows)
    likedImages: Map<string, boolean>;
    // Map of imageId -> server's known state (last synced)
    serverLikedImages: Map<string, boolean>;
    // Set of imageIds with pending sync operations
    pendingSyncs: Set<string>;

    // Actions
    setLiked: (imageId: string, isLiked: boolean) => void;
    toggleLike: (imageId: string) => void;
    isLiked: (imageId: string) => boolean;

    // Server state management
    getServerState: (imageId: string) => boolean;
    setServerState: (imageId: string, isLiked: boolean) => void;

    // Pending sync management
    addPendingSync: (imageId: string) => void;
    removePendingSync: (imageId: string) => void;
    hasPendingSync: (imageId: string) => boolean;

    // Initialize from API data
    initFromApiData: (images: Array<{ id: string; isUserLiked?: boolean }>) => void;
}

/**
 * Zustand store for like state - single source of truth
 * 
 * Instagram/Pinterest-style optimistic updates:
 * 1. likedImages tracks what the UI shows (instant updates)
 * 2. serverLikedImages tracks what the server knows (for sync comparison)
 * 3. pendingSyncs tracks which images have pending sync operations
 * 4. No pending states in UI - button is always interactive
 */
export const useLikesStore = create<LikesState>((set, get) => ({
    likedImages: new Map<string, boolean>(),
    serverLikedImages: new Map<string, boolean>(),
    pendingSyncs: new Set<string>(),

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

    addPendingSync: (imageId) => set((state) => {
        const newSet = new Set(state.pendingSyncs);
        newSet.add(imageId);
        return { pendingSyncs: newSet };
    }),

    removePendingSync: (imageId) => set((state) => {
        const newSet = new Set(state.pendingSyncs);
        newSet.delete(imageId);
        return { pendingSyncs: newSet };
    }),

    hasPendingSync: (imageId) => get().pendingSyncs.has(imageId),

    initFromApiData: (images) => set((state) => {
        const newLikedMap = new Map(state.likedImages);
        const newServerMap = new Map(state.serverLikedImages);

        for (const image of images) {
            const isLiked = image.isUserLiked || false;

            // Only preserve local optimistic state if a sync is pending
            // Otherwise, reconcile with server state (source of truth)
            const hasPending = state.pendingSyncs.has(image.id);
            if (!hasPending) {
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

