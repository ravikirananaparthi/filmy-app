// API Endpoint constants
export const API_ENDPOINTS = {
    // Auth
    AUTH: {
        SEND_OTP: '/auth/phone/start',
        VERIFY_OTP: '/auth/phone/verify',
    },

    // Onboarding
    ONBOARDING: {
        PREFERENCES: '/onboarding/preferences',
        FOLLOW: '/onboarding/follow',
        SUGGESTED_ACTRESSES: '/onboarding/suggested-actresses',
    },

    // Feed
    FEED: {
        DEFAULT: '/feed/default',
        FOR_YOU: '/feed/for-you',
        FRESH: '/feed/fresh',
        MAGIC_SHUFFLE: '/feed/magic-shuffle',
        BLEND: '/feed/blend',
        CUSTOM_BLEND: '/feed/custom-blend',
    },

    // Images
    IMAGES: {
        LIST: '/images',
        DETAIL: (id: string) => `/images/${id}`,
        LIKE: (id: string) => `/images/${id}/like`,
        UNLIKE: (id: string) => `/images/${id}/like`, // DELETE same endpoint as LIKE
        DOWNLOAD: (id: string) => `/images/${id}/download`,
        WALLPAPER: (id: string) => `/images/${id}/wallpaper`,
    },

    // Actresses
    ACTRESSES: {
        LIST: '/actresses',
        SEARCH: '/actresses/search',
        DETAIL: (id: string) => `/actresses/${id}`,
        FOLLOW: (id: string) => `/actresses/${id}/follow`,
        UNFOLLOW: (id: string) => `/actresses/${id}/follow`, // DELETE same endpoint
    },

    // Trending
    TRENDING: {
        IMAGES: '/trending',
    },

    // Explore
    EXPLORE: {
        HIGHLIGHTS: '/explore/highlights',
        FEATURED_ACTRESSES: '/explore/featured-actresses',
    },

    // Favorites
    FAVORITES: {
        PREVIEW: '/favorites/preview',
        FOLDERS: '/favorites/folders',
        CREATE_FOLDER: '/favorites/folders',
        FOLDER_IMAGES: (folderId: string) => `/favorites/folders/${folderId}/images`,
        ADD_IMAGE: (folderId: string, imageId: string) => `/favorites/folders/${folderId}/images/${imageId}`,
    },

    // Likes
    LIKES: {
        LIST: '/likes',
        COUNT: '/likes/count',
    },

    // Tags
    TAGS: {
        POPULAR: '/tags/popular',
        SEARCH: '/tags/search',
        ALL: '/tags',
    },

    // Search
    SEARCH: {
        UNIFIED: '/search',
        AUTOCOMPLETE: '/search/autocomplete',
        RECENT: '/search/recent',
    },

    // Admin (not needed for app, but included for reference)
    ADMIN: {
        CREATE_ACTRESS: '/admin/actress',
        UPDATE_ACTRESS: (id: string) => `/admin/actress/${id}`,
        DELETE_ACTRESS: (id: string) => `/admin/actress/${id}`,
        UPLOAD_IMAGE: '/admin/image',
        BULK_UPLOAD: '/admin/image/bulk',
        UPDATE_IMAGE: (id: string) => `/admin/image/${id}`,
        DELETE_IMAGE: (id: string) => `/admin/image/${id}`,
        CREATE_TAG: '/admin/tags',
    },
} as const;
