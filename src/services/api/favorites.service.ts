/**
 * Favorites API Service
 * Handles folder management, preview, and saving images to collections
 */
import type {
    AddImageToFolderResponse,
    CreateFolderRequest,
    CreateFolderResponse,
    FavoritesPreviewResponse,
    FolderListResponse,
} from '@/src/types/favorites.types';
import type { Image } from '@/src/types/image.types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';

// ============ Types for API Response (camelCase) ============

interface FolderImageApiResponse {
    id: string;
    thumbnailUrl: string;
    aspectRatio: number;
    blurHash?: string;
    isUserLiked?: boolean;
    actress?: {
        id: string;
        name: string;
    };
    savedAt?: string;
}

interface FolderImagesApiResponse {
    success: boolean;
    data: {
        folder: {
            id: string;
            name: string;
        };
        images: FolderImageApiResponse[];
        pagination: {
            limit: number;
            hasNextPage: boolean;
            nextCursor?: string;
        };
    };
}

export interface FolderImagesResponse {
    success: boolean;
    data: {
        folder: {
            id: string;
            name: string;
        };
        images: Image[];
        pagination: {
            limit: number;
            hasNextPage: boolean;
            nextCursor?: string;
        };
    };
}

// ============ Transform Functions ============

/**
 * Transform camelCase API response to snake_case Image type
 */
const transformFolderImage = (img: FolderImageApiResponse): Image => ({
    id: img.id,
    actress_id: img.actress?.id || '',
    image_url: '', // Not returned by API
    thumbnail_url: img.thumbnailUrl,
    width: 0,
    height: 0,
    aspect_ratio: img.aspectRatio,
    file_size: 0,
    format: 'webp',
    is_webp: true,
    blurhash: img.blurHash || '',
    hotness_rating: 0,
    created_at: img.savedAt || '',
    isUserLiked: img.isUserLiked,
    actress: img.actress ? {
        id: img.actress.id,
        name: img.actress.name,
        cover_image_url: '',
    } : undefined,
});

// ============ API Functions ============

/**
 * Get favorites preview (5 liked + 5 saved thumbnails)
 */
export const getFavoritesPreview = async (): Promise<FavoritesPreviewResponse> => {
    const response = await apiClient.get<FavoritesPreviewResponse>(
        API_ENDPOINTS.FAVORITES.PREVIEW
    );
    return response.data;
};

/**
 * Get all user's folders
 */
export const getFolders = async (): Promise<FolderListResponse> => {
    const response = await apiClient.get<FolderListResponse>(
        API_ENDPOINTS.FAVORITES.FOLDERS
    );
    return response.data;
};

/**
 * Get images in a folder (cursor pagination)
 */
export const getFolderImages = async (
    folderId: string,
    params: { limit?: number; cursor?: string } = {}
): Promise<FolderImagesResponse> => {
    const response = await apiClient.get<FolderImagesApiResponse>(
        API_ENDPOINTS.FAVORITES.FOLDER_IMAGES(folderId),
        { params }
    );

    // Transform camelCase to snake_case
    return {
        success: response.data.success,
        data: {
            folder: response.data.data.folder,
            images: response.data.data.images.map(transformFolderImage),
            pagination: response.data.data.pagination,
        },
    };
};

/**
 * Create a new folder
 */
export const createFolder = async (name: string): Promise<CreateFolderResponse> => {
    const response = await apiClient.post<CreateFolderResponse>(
        API_ENDPOINTS.FAVORITES.CREATE_FOLDER,
        { name } as CreateFolderRequest
    );
    return response.data;
};

/**
 * Add image to a folder
 */
export const addImageToFolder = async (
    folderId: string,
    imageId: string
): Promise<AddImageToFolderResponse> => {
    const response = await apiClient.post<AddImageToFolderResponse>(
        API_ENDPOINTS.FAVORITES.ADD_IMAGE(folderId, imageId)
    );
    return response.data;
};
