/**
 * Favorites Types
 * Types for folder system and favorite images
 */

export interface FavoriteFolderCover {
    id: string;
    imageUrl: string;
}

export interface FavoriteFolder {
    id: string;
    name: string;
    isDefault: boolean;
    imageCount: number;
    coverImage: FavoriteFolderCover | null;
    createdAt: string;
    updatedAt: string;
}

export interface FolderListResponse {
    success: boolean;
    message: string;
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
