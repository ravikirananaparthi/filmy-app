import type { Image } from '@types/image.types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';

export interface UserProfile {
    id: string;
    email: string;
    displayName: string;
    avatarUrl: string | null;
    postsCount: number;
    followingCount: number;
}

export interface UserUploadsPage {
    data: Image[];
    pagination: {
        limit: number;
        hasNextPage: boolean;
        nextCursor: string | null;
    };
}

export const getUserProfile = async (): Promise<UserProfile> => {
    const response = await apiClient.get<{ success: boolean; data: UserProfile }>(
        API_ENDPOINTS.USER.ME
    );
    return response.data.data;
};

export const getUserUploads = async (params: {
    limit?: number;
    cursor?: string;
} = {}): Promise<UserUploadsPage> => {
    const response = await apiClient.get<{ success: boolean; data: { images: Image[]; pagination: UserUploadsPage['pagination'] } }>(
        API_ENDPOINTS.USER.UPLOADS,
        { params }
    );
    return {
        data: response.data.data.images,
        pagination: response.data.data.pagination,
    };
};
