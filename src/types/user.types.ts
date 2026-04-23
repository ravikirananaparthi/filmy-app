// User entity types

export interface User {
    id: string;
    supabase_id?: string;
    email?: string;
    display_name?: string;
    avatar_url?: string;
    phone_number?: string;
    country_code?: string;
    preferences: string[];
    favorite_actress_ids: string[];
    role: 'user' | 'admin';
    is_new_user?: boolean;
    created_at: string;
    updated_at?: string;
}

export interface Session {
    access_token: string;
    refresh_token: string;
    expires_at?: number;
}

export interface AuthResponse {
    user: User;
    session: Session;
}
