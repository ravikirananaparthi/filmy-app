import { likeImage, unlikeImage } from '@services/api/image.service';
import { useLikesStore } from '@store/slices/likesSlice';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef } from 'react';

// Debounce delay before syncing to server (ms)
const SYNC_DEBOUNCE_MS = 500;

// Global map to track debounce timers across hook instances
const debouncedTimers = new Map<string, NodeJS.Timeout>();

/**
 * Production-grade like hook following Instagram/Pinterest patterns
 * 
 * Key behaviors:
 * 1. UI updates INSTANTLY on every tap (no loading states)
 * 2. API calls are debounced - waits 500ms after last tap
 * 3. Only syncs when local state differs from server state
 * 4. Errors are logged but don't affect UI
 */
export const useLike = () => {
    const { toggleLike: storeToggleLike, setServerState, isLiked, getServerState } = useLikesStore();
    const isMountedRef = useRef(true);

    // Cleanup on unmount
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    /**
     * Sync local state to server
     * Only calls API if local state differs from server state
     */
    const syncToServer = useCallback(async (imageId: string) => {
        const localState = useLikesStore.getState().isLiked(imageId);
        const serverState = useLikesStore.getState().getServerState(imageId);

        // Skip if already in sync
        if (localState === serverState) {
            console.log('✅ Already in sync, skipping API call:', { imageId, state: localState });
            return;
        }

        console.log('🚀 Syncing to server:', { imageId, localState, serverState, action: localState ? 'LIKE' : 'UNLIKE' });

        try {
            if (localState) {
                await likeImage(imageId);
            } else {
                await unlikeImage(imageId);
            }

            // Update server state on success
            if (isMountedRef.current) {
                setServerState(imageId, localState);
                console.log('✅ Sync succeeded:', { imageId, newServerState: localState });
            }
        } catch (error) {
            // Log error but don't rollback UI - user intent is preserved
            // The next feed refresh will reconcile state if needed
            console.warn('⚠️ Sync failed (UI preserved):', { imageId, error });
        }
    }, [setServerState]);

    /**
     * Toggle like state with debounced server sync
     * 
     * Handles rapid taps gracefully:
     * - Each tap instantly updates the UI
     * - Only the final state syncs to server after 500ms of inactivity
     */
    const toggleLike = useCallback((imageId: string) => {
        const wasLiked = useLikesStore.getState().isLiked(imageId);

        console.log('👆 toggleLike:', { imageId, wasLiked, newState: !wasLiked });

        // 1. Haptic feedback only when liking (not unliking)
        if (!wasLiked) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }

        // 2. Instant UI update
        storeToggleLike(imageId);

        // 3. Clear existing debounce timer for this image
        const existingTimer = debouncedTimers.get(imageId);
        if (existingTimer) {
            clearTimeout(existingTimer);
        }

        // 4. Schedule new sync after debounce delay
        const timer = setTimeout(() => {
            debouncedTimers.delete(imageId);
            syncToServer(imageId);
        }, SYNC_DEBOUNCE_MS);

        debouncedTimers.set(imageId, timer);
    }, [storeToggleLike, syncToServer]);

    return { toggleLike };
};

export default useLike;
