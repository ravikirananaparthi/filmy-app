/**
 * useFavorites Hook
 * React Query hooks for favorite folders management
 */
import {
    addImageToFolder,
    createFolder,
    getFolders,
} from '@/src/services/api/favorites.service';
import type { FavoriteFolder } from '@/src/types/favorites.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { Platform, ToastAndroid } from 'react-native';

// Query keys
export const FAVORITES_KEYS = {
    folders: ['favorites', 'folders'] as const,
};

/**
 * Hook to fetch user's folders
 */
export const useFolders = () => {
    return useQuery({
        queryKey: FAVORITES_KEYS.folders,
        queryFn: async () => {
            const response = await getFolders();
            return response.data.folders;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Hook to create a new folder
 */
export const useCreateFolder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (name: string) => createFolder(name),
        onSuccess: (response) => {
            // Add new folder to cache optimistically
            queryClient.setQueryData<FavoriteFolder[]>(
                FAVORITES_KEYS.folders,
                (old) => {
                    if (!old) return [response.data.folder];
                    return [...old, response.data.folder];
                }
            );

        },
        onError: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        },
    });
};

/**
 * Hook to add image to a folder
 */
export const useAddToFolder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ folderId, imageId }: { folderId: string; imageId: string }) =>
            addImageToFolder(folderId, imageId),
        onSuccess: (_, { folderId }) => {
            // Invalidate folders to update image count
            queryClient.invalidateQueries({ queryKey: FAVORITES_KEYS.folders });
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            if (Platform.OS === 'android') {
                ToastAndroid.show('Image saved to collection!', ToastAndroid.SHORT);
            }
        },
        onError: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        },
    });
};

/**
 * Get default folder from list
 */
export const getDefaultFolder = (folders: FavoriteFolder[] | undefined): FavoriteFolder | undefined => {
    return folders?.find((f) => f.isDefault);
};

export default useFolders;
