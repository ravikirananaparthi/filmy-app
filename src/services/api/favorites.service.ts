/**
 * Favorites API Service
 * Handles folder management and saving images to collections
 */
import type {
    AddImageToFolderResponse,
    CreateFolderRequest,
    CreateFolderResponse,
    FolderListResponse,
} from '@/src/types/favorites.types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';

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
