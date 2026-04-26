import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import type { SelectedImage } from '@store/slices/uploadSlice';

export interface UploadPostResult {
    images: any[];
    count: number;
}

/**
 * Upload 1–10 images as a user post.
 *
 * @param images       - Array of selected images from expo-image-picker
 * @param tagsPerImage - Parallel array of tag arrays, one per image
 * @param onProgress   - Optional callback receiving 0–100 progress
 */
export const uploadPost = async (
    images: SelectedImage[],
    tagsPerImage: string[][],
    onProgress?: (progress: number) => void
): Promise<UploadPostResult> => {
    const formData = new FormData();

    images.forEach((image, index) => {
        const ext = image.fileName.split('.').pop()?.toLowerCase() || 'jpg';
        formData.append('files', {
            uri: image.uri,
            type: image.type || `image/${ext}`,
            name: image.fileName || `image_${index}.${ext}`,
        } as any);
    });

    formData.append('tags', JSON.stringify(tagsPerImage));

    const response = await apiClient.post<{
        success: boolean;
        data: UploadPostResult;
    }>(API_ENDPOINTS.UPLOAD.POST, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
            if (evt.total) {
                onProgress?.(Math.round((evt.loaded * 100) / evt.total));
            }
        },
    });

    return response.data.data;
};
