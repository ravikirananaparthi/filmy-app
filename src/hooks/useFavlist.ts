import { followActress, unfollowActress } from '@services/api/followActress.service';
import { useFavlistStore } from '@store/slices/favlistSlice';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef } from 'react';

// Debounce delay before syncing to server (ms)
const SYNC_DEBOUNCE_MS = 500;

// Global map to track debounce timers across hook instances
const debouncedTimers = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * Production-grade favlist (follow) hook following Instagram/Pinterest patterns
 * 
 * Key behaviors:
 * 1. UI updates INSTANTLY on every tap (no loading states)
 * 2. API calls are debounced - waits 500ms after last tap
 * 3. Only syncs when local state differs from server state
 * 4. Errors are logged but don't affect UI
 * 5. Pending syncs are tracked so page refreshes don't clobber in-flight changes
 */
export const useFavlist = () => {
    const {
        toggleFollow: storeToggleFollow,
        setServerState,
        addPendingSync,
        removePendingSync
    } = useFavlistStore();
    const isMountedRef = useRef(true);

    // Track which actress IDs this hook instance has scheduled timers for
    const scheduledIdsRef = useRef<Set<string>>(new Set());

    // Cleanup on unmount - clear all timers scheduled by this instance
    useEffect(() => {
        isMountedRef.current = true;
        const scheduledIds = scheduledIdsRef.current;

        return () => {
            isMountedRef.current = false;

            // Clear all timers scheduled by this hook instance
            scheduledIds.forEach((actressId) => {
                const timer = debouncedTimers.get(actressId);
                if (timer) {
                    clearTimeout(timer);
                    debouncedTimers.delete(actressId);
                }
                // Remove from pending syncs since the timer was cancelled
                removePendingSync(actressId);
            });
            scheduledIds.clear();
        };
    }, [removePendingSync]);

    /**
     * Sync local state to server
     * Only calls API if local state differs from server state
     */
    const syncToServer = useCallback(async (actressId: string) => {
        const localState = useFavlistStore.getState().isFollowed(actressId);
        const serverState = useFavlistStore.getState().getServerState(actressId);

        // Remove from pending syncs - we're now attempting the sync
        removePendingSync(actressId);

        // Skip if already in sync
        if (localState === serverState) {
            console.log('✅ Favlist already in sync, skipping API call:', { actressId, state: localState });
            return;
        }

        console.log('🚀 Syncing favlist to server:', { actressId, localState, serverState, action: localState ? 'FOLLOW' : 'UNFOLLOW' });

        try {
            if (localState) {
                await followActress(actressId);
            } else {
                await unfollowActress(actressId);
            }

            // Update server state on success
            if (isMountedRef.current) {
                setServerState(actressId, localState);
                console.log('✅ Favlist sync succeeded:', { actressId, newServerState: localState });
            }
        } catch (error) {
            // Log error but don't rollback UI - user intent is preserved
            // The next page refresh will reconcile state since no pending sync exists
            console.warn('⚠️ Favlist sync failed (UI preserved):', { actressId, error });
        }
    }, [setServerState, removePendingSync]);

    /**
     * Toggle follow state with debounced server sync
     * 
     * Handles rapid taps gracefully:
     * - Each tap instantly updates the UI
     * - Only the final state syncs to server after 500ms of inactivity
     */
    const toggleFollow = useCallback((actressId: string) => {
        const wasFollowed = useFavlistStore.getState().isFollowed(actressId);

        console.log('👆 toggleFollow:', { actressId, wasFollowed, newState: !wasFollowed });

        // 1. Haptic feedback only when following (not unfollowing)
        if (!wasFollowed) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }

        // 2. Instant UI update
        storeToggleFollow(actressId);

        // 3. Clear existing debounce timer for this actress
        const existingTimer = debouncedTimers.get(actressId);
        if (existingTimer) {
            clearTimeout(existingTimer);
            debouncedTimers.delete(actressId);
            scheduledIdsRef.current.delete(actressId);
            // Note: Don't remove from pendingSyncs here - we're about to add it back
        }

        // 4. Mark as pending sync (protects from page refresh overwriting)
        addPendingSync(actressId);

        // 5. Schedule new sync after debounce delay
        const timer = setTimeout(() => {
            debouncedTimers.delete(actressId);
            scheduledIdsRef.current.delete(actressId);
            syncToServer(actressId);
        }, SYNC_DEBOUNCE_MS);

        debouncedTimers.set(actressId, timer);
        scheduledIdsRef.current.add(actressId);
    }, [storeToggleFollow, syncToServer, addPendingSync]);

    return { toggleFollow };
};

export default useFavlist;
