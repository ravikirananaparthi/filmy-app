// Common API response types

export interface ApiSuccessResponse<T = any> {
    success: true;
    message?: string;
    data: T;
}

export interface ApiErrorResponse {
    success: false;
    message: string;
    error?: any;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface PaginatedApiResponse<T = any> {
    success: boolean;
    data: T[];
    pagination: PaginationMeta;
}

// Default feed response structure (images nested in data.images)
export interface DefaultFeedApiResponse {
    success: boolean;
    message?: string;
    data: {
        images: any[]; // Will be Image[] but avoiding circular dependency
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    };
}

// For You Feed response structure with cursor pagination
export interface ForYouFeedApiResponse {
    success: boolean;
    message?: string;
    data: {
        images: any[]; // Will be Image[] but avoiding circular dependency
        pagination: {
            limit: number;
            hasNextPage: boolean;
            nextCursor?: { score: number; id: string };
        };
    };
}

// Filter types
export interface ImageFilterParams {
    tags?: string[];
    minHotness?: number;
    maxHotness?: number;
    sortBy?: 'popularity' | 'recent' | 'hotness';
}

export interface FeedParams extends PaginationParams, ImageFilterParams { }

export interface ActressListParams extends PaginationParams {
    sortBy?: 'popularity' | 'recent' | 'name';
}

export interface SearchParams extends PaginationParams {
    query: string;
}
