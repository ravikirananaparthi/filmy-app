/**
 * Download Service - Cross-platform image download utility
 * Handles downloading images to the device's gallery on both Android and iOS
 * Organizes images into: Filmy App/[Actress Name]/
 */

import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import { Alert, Platform, ToastAndroid } from 'react-native';

// Main album name for the app
const ALBUM_NAME = 'Filmy App';

interface DownloadResult {
    success: boolean;
    error?: string;
}

interface DownloadOptions {
    imageUrl: string;
    imageId: string;
    actressName?: string;
}

/**
 * Shows a toast on Android or an alert on iOS
 */
const showToast = (message: string, isError = false) => {
    if (Platform.OS === 'android') {
        ToastAndroid.show(message, isError ? ToastAndroid.LONG : ToastAndroid.SHORT);
    }
};

/**
 * Request media library permissions
 * @returns true if permission granted, false otherwise
 */
export const requestMediaPermissions = async (): Promise<boolean> => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert(
            'Permission Required',
            'Please allow access to save images to your gallery.'
        );
        return false;
    }
    return true;
};

/**
 * Get or create an album
 * @param albumName - Name of the album to get or create
 * @param asset - Asset to add to album (required for creating new album)
 * @returns The album or null if failed
 */
const getOrCreateAlbum = async (
    albumName: string,
    asset: MediaLibrary.Asset
): Promise<MediaLibrary.Album | null> => {
    try {
        // Try to find existing album
        let album = await MediaLibrary.getAlbumAsync(albumName);

        if (album) {
            // Album exists, add asset to it (move=true to avoid permission prompts)
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, true);
        } else {
            // Create new album with the asset (move=true to avoid permission prompts)
            album = await MediaLibrary.createAlbumAsync(albumName, asset, true);
        }

        return album;
    } catch (error) {
        console.error(`Failed to get/create album "${albumName}":`, error);
        return null;
    }
};

/**
 * Download an image to the device's gallery
 * Organizes into: Filmy App/[Actress Name]/ folder structure
 * 
 * @param options - Download options including URL, ID, and actress name
 * @returns DownloadResult with success status and optional error
 */
export const downloadImageToGallery = async (
    imageUrl: string,
    imageId: string,
    actressName?: string
): Promise<DownloadResult> => {
    try {
        // Request permissions first
        const hasPermission = await requestMediaPermissions();
        if (!hasPermission) {
            return { success: false, error: 'Permission denied' };
        }

        // Generate unique filename with actress name for organization
        const sanitizedActressName = actressName?.replace(/[^a-zA-Z0-9\s]/g, '') || 'Unknown';

        // Extract file extension from URL (default to jpg if not found)
        const urlPath = imageUrl.split('?')[0]; // Remove query params
        const urlExtension = urlPath.match(/\.(jpg|jpeg|png|webp|gif)$/i)?.[1]?.toLowerCase() || 'jpg';

        // Generate unique filename with timestamp + random number to prevent duplicates
        const randomSuffix = Math.floor(Math.random() * 10000);
        const fileName = `${imageId}_${randomSuffix}.${urlExtension}`;
        const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

        // Show loading toast
        showToast('Saving Photo...');

        // Download image to cache
        const downloadResult = await FileSystem.downloadAsync(imageUrl, fileUri);

        if (downloadResult.status !== 200) {
            throw new Error(`Download failed with status ${downloadResult.status}`);
        }

        // First save to library to get asset
        const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);

        // Save all images to single "Filmy App" album
        await getOrCreateAlbum(ALBUM_NAME, asset);

        // Show success feedback
        showToast('Saved to Gallery!');

        return { success: true };
    } catch (error: any) {
        const errorMessage = error?.message || 'Unknown error';
        console.error('Download failed:', error);
        showToast(`Failed to save: ${errorMessage}`, true);
        return { success: false, error: errorMessage };
    }
};

export default {
    downloadImageToGallery,
    requestMediaPermissions,
};
