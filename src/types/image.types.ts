// Image entity types

export interface Image {
    id: string;
    actress_id: string;
    image_url: string;
    thumbnail_url: string;
    width: number;
    height: number;
    aspect_ratio: number;
    file_size: number;
    format: string;
    is_webp: boolean;
    blurhash: string;
    tags?: string[];
    tag_ids?: string[];
    hotness_rating: number; // 1-10
    created_at: string;
    updated_at?: string;

    // For You Feed specific fields
    isUserLiked?: boolean;
    actress?: {
        id: string;
        name: string;
        cover_image_url: string;
    };
    popularity_score?: number;
    personalized_score?: number;
    likes_count?: number;
    downloads_count?: number;
}

export interface ImageDetail extends Image {
    actress?: {
        id: string;
        name: string;
        cover_image_url: string;
    };
    is_liked?: boolean;
    like_count?: number;
    download_count?: number;
}

export interface ImageCard {
    id: string;
    thumbnail_url: string;
    blurhash: string;
    aspect_ratio: number;
    hotness_rating: number;
    actress_id: string;
}
