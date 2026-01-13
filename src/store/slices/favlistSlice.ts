import { create } from 'zustand';

interface FavlistState {
    // Map of actressId -> local followed status (what UI shows)
    followedActresses: Map<string, boolean>;
    // Map of actressId -> server's known state (last synced)
    serverFollowedActresses: Map<string, boolean>;
    // Set of actressIds with pending sync operations
    pendingSyncs: Set<string>;

    // Actions
    setFollowed: (actressId: string, isFollowed: boolean) => void;
    toggleFollow: (actressId: string) => void;
    isFollowed: (actressId: string) => boolean;

    // Server state management
    getServerState: (actressId: string) => boolean;
    setServerState: (actressId: string, isFollowed: boolean) => void;

    // Pending sync management
    addPendingSync: (actressId: string) => void;
    removePendingSync: (actressId: string) => void;
    hasPendingSync: (actressId: string) => boolean;

    // Initialize from API data
    initFromApiData: (actresses: Array<{ id: string; is_followed?: boolean }>) => void;
}

/**
 * Zustand store for follow/favlist state - single source of truth
 * 
 * Instagram/Pinterest-style optimistic updates:
 * 1. followedActresses tracks what the UI shows (instant updates)
 * 2. serverFollowedActresses tracks what the server knows (for sync comparison)
 * 3. pendingSyncs tracks which actresses have pending sync operations
 * 4. No pending states in UI - button is always interactive
 */
export const useFavlistStore = create<FavlistState>((set, get) => ({
    followedActresses: new Map<string, boolean>(),
    serverFollowedActresses: new Map<string, boolean>(),
    pendingSyncs: new Set<string>(),

    setFollowed: (actressId, isFollowed) => set((state) => {
        const newMap = new Map(state.followedActresses);
        newMap.set(actressId, isFollowed);
        return { followedActresses: newMap };
    }),

    toggleFollow: (actressId) => set((state) => {
        const newMap = new Map(state.followedActresses);
        const currentValue = newMap.get(actressId) || false;
        newMap.set(actressId, !currentValue);
        return { followedActresses: newMap };
    }),

    isFollowed: (actressId) => get().followedActresses.get(actressId) || false,

    getServerState: (actressId) => get().serverFollowedActresses.get(actressId) || false,

    setServerState: (actressId, isFollowed) => set((state) => {
        const newMap = new Map(state.serverFollowedActresses);
        newMap.set(actressId, isFollowed);
        return { serverFollowedActresses: newMap };
    }),

    addPendingSync: (actressId) => set((state) => {
        const newSet = new Set(state.pendingSyncs);
        newSet.add(actressId);
        return { pendingSyncs: newSet };
    }),

    removePendingSync: (actressId) => set((state) => {
        const newSet = new Set(state.pendingSyncs);
        newSet.delete(actressId);
        return { pendingSyncs: newSet };
    }),

    hasPendingSync: (actressId) => get().pendingSyncs.has(actressId),

    initFromApiData: (actresses) => set((state) => {
        const newFollowedMap = new Map(state.followedActresses);
        const newServerMap = new Map(state.serverFollowedActresses);

        for (const actress of actresses) {
            const isFollowed = actress.is_followed || false;

            // Only preserve local optimistic state if a sync is pending
            // Otherwise, reconcile with server state (source of truth)
            const hasPending = state.pendingSyncs.has(actress.id);
            if (!hasPending) {
                newFollowedMap.set(actress.id, isFollowed);
            }

            // Always update server state from API
            newServerMap.set(actress.id, isFollowed);
        }

        return {
            followedActresses: newFollowedMap,
            serverFollowedActresses: newServerMap,
        };
    }),
}));

export default useFavlistStore;
