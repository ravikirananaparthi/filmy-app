/**
 * Favorites Types
 * Types for folder system, preview, and favorite images
 */
import type { Image } from './image.types';

// ============ Folder Types ============

export interface FavoriteFolderCover {
    id: string;
    thumbnailUrl: string;
}

export interface FavoriteFolder {
    id: string;
    name: string;
    isDefault: boolean;
    imageCount: number;
    coverImage: FavoriteFolderCover | null;
}

export interface FolderListResponse {
    success: boolean;
    data: {
        folders: FavoriteFolder[];
    };
}

export interface CreateFolderRequest {
    name: string;
}

export interface CreateFolderResponse {
    success: boolean;
    message: string;
    data: {
        folder: FavoriteFolder;
    };
}

export interface AddImageToFolderResponse {
    success: boolean;
    message: string;
}

// ============ Preview Types ============

export interface PreviewImage {
    id: string;
    thumbnailUrl: string;
    aspectRatio: number;
    blurHash?: string;
}

export interface FollowingProfile {
    id: string;
    name: string;
    coverImageUrl: string;
}

export interface FavoritesPreviewData {
    liked: {
        images: PreviewImage[];
        totalCount: number;
    };
    saved: {
        images: PreviewImage[];
        totalCount: number;
    };
    following: FollowingProfile[];
}

export interface FavoritesPreviewResponse {
    success: boolean;
    data: FavoritesPreviewData;
}

// ============ Folder Images Types ============

export interface FolderImagesResponse {
    success: boolean;
    data: {
        images: Image[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
}
