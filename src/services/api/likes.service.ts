/**
 * Likes API Service
 * Handles fetching liked images with cursor pagination
 */
import type { Image } from '@/src/types/image.types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';

// ============ Types ============

// API response uses camelCase with simplified fields
export interface LikedImageApiResponse {
    id: string;
    thumbnailUrl: string;
    aspectRatio: number;
    blurHash?: string;
    isUserLiked: boolean;
    actress: {
        id: string;
        name: string;
    };
    likedAt: string;
}

export interface LikedImagesApiResponse {
    success: boolean;
    message?: string;
    data: {
        images: LikedImageApiResponse[];
        pagination: {
            limit: number;
            hasNextPage: boolean;
            nextCursor?: string;
        };
    };
}

export interface LikedImage extends Image {
    likedAt: string;
}

export interface LikedImagesResponse {
    success: boolean;
    data: {
        images: LikedImage[];
        pagination: {
            limit: number;
            hasNextPage: boolean;
            nextCursor?: string;
        };
    };
}

export interface LikesCountResponse {
    success: boolean;
    data: {
        count: number;
    };
}

// ============ Transform Functions ============

/**
 * Transform camelCase API response to snake_case Image type
 */
const transformLikedImage = (img: LikedImageApiResponse): LikedImage => ({
    id: img.id,
    actress_id: img.actress?.id || '',
    image_url: '', // Not returned by simplified API
    thumbnail_url: img.thumbnailUrl,
    width: 0,
    height: 0,
    aspect_ratio: img.aspectRatio,
    file_size: 0,
    format: 'webp',
    is_webp: true,
    blurhash: img.blurHash || '',
    hotness_rating: 0,
    created_at: img.likedAt,
    isUserLiked: img.isUserLiked,
    actress: img.actress ? {
        id: img.actress.id,
        name: img.actress.name,
        cover_image_url: '',
    } : undefined,
    likedAt: img.likedAt,
});

// ============ API Functions ============

/**
 * Get all liked images with cursor pagination
 */
export const getLikedImages = async (params: {
    limit?: number;
    cursor?: string;
} = {}): Promise<LikedImagesResponse> => {
    const response = await apiClient.get<LikedImagesApiResponse>(
        API_ENDPOINTS.LIKES.LIST,
        { params }
    );

    // Transform camelCase to snake_case
    return {
        success: response.data.success,
        data: {
            images: response.data.data.images.map(transformLikedImage),
            pagination: response.data.data.pagination,
        },
    };
};

/**
 * Get total count of liked images
 */
export const getLikesCount = async (): Promise<LikesCountResponse> => {
    const response = await apiClient.get<LikesCountResponse>(
        API_ENDPOINTS.LIKES.COUNT
    );
    return response.data;
};
