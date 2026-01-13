/**
 * Follow Actress API Service
 * Handles follow/unfollow actress operations
 */
import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';

/**
 * Follow an actress
 */
export const followActress = async (actressId: string): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.ACTRESSES.FOLLOW(actressId));
};

/**
 * Unfollow an actress
 */
export const unfollowActress = async (actressId: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.ACTRESSES.UNFOLLOW(actressId));
};
