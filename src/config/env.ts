// Environment configuration
// Values are read from .env file (EXPO_PUBLIC_ prefix required)
// Restart the dev server after changing .env values

export const ENV = {
    API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://filmy-backend.onrender.com/api/v1',
    SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
    SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
    IS_DEV: __DEV__,
} as const;
