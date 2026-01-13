// Actress entity types

export interface Actress {
    id: string;
    name: string;
    cover_image_url: string;
    popularity_rating: number; // 1-100
    hotness_rating: number; // 1-10
    tags?: string[];
    tag_ids?: string[];
    image_count?: number;
    created_at: string;
    updated_at?: string;
}

export interface ActressProfile extends Actress {
    images: any[]; // Will be Image[] type
    image_count: number;
    is_followed?: boolean;
}

export interface ActressCard {
    id: string;
    name: string;
    cover_image_url: string;
    image_count?: number;
    popularity_rating: number;
}

// API Response wrapper for actress profile endpoint
export interface ActressProfileResponse {
    actress: ActressProfile;
    pagination: {
        page: number;
        limit: number;
        totalImages: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
    filters?: {
        tags?: string[];
        minHotness?: number;
        maxHotness?: number;
        sortBy?: string;
    };
}
