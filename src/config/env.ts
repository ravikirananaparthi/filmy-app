// Environment configuration
export const ENV = {
    API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
    DEV_AUTH_TOKEN: process.env.EXPO_PUBLIC_DEV_TOKEN || 'your-dev-token-here',
    IS_DEV: __DEV__,
} as const;
