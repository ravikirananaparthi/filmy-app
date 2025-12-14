// User entity types

export interface User {
    id: string;
    phone_number: string;
    country_code: string;
    preferences: string[];
    favorite_actress_ids: string[];
    role: 'user' | 'admin';
    is_new_user: boolean;
    created_at: string;
    updated_at?: string;
}

export interface Session {
    access_token: string;
    refresh_token: string;
}

export interface AuthResponse {
    user: User;
    session: Session;
}
