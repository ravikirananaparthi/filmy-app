import { supabase } from '@config/supabase';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

// Note: WebBrowser.maybeCompleteAuthSession() is called in app/auth/callback.tsx
// (the component that renders at the OAuth redirect URI path) — not here.

/**
 * Deep-link URI Supabase redirects to after Google OAuth.
 *
 * ⚠️  This exact value MUST be added to:
 *   Supabase Dashboard → Authentication → URL Configuration → Redirect URLs
 *
 * Add:  filmyapp://auth/callback
 *       filmyapp://**
 */
const REDIRECT_URI = makeRedirectUri({
    scheme: 'filmyapp',
    path: 'auth/callback',
});

if (__DEV__) {
    console.log('[authService] OAuth redirect URI:', REDIRECT_URI);
}

/**
 * Extract Supabase tokens from the deep-link callback URL.
 * Supabase encodes them in the URL hash fragment:
 *   filmyapp://auth/callback#access_token=...&refresh_token=...
 * but may also use the query string on some platforms.
 */
function extractTokens(url: string) {
    // Try hash fragment first (Supabase default), fall back to query string
    const raw = url.includes('#')
        ? url.split('#')[1]
        : url.includes('?')
        ? url.split('?')[1]
        : '';

    const params = new URLSearchParams(raw);
    return {
        accessToken: params.get('access_token'),
        refreshToken: params.get('refresh_token'),
        error: params.get('error_description') ?? params.get('error'),
    };
}

export const authService = {
    /**
     * Email + password sign-in. Used for the demo account.
     * Returns the same `{ session, cancelled }` shape as signInWithGoogle so callers
     * can share a single handler.
     */
    signInWithEmail: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return { session: data.session, cancelled: false };
    },

    signInWithGoogle: async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: REDIRECT_URI,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
                skipBrowserRedirect: true,
            },
        });

        if (error) throw error;
        if (!data.url) throw new Error('No OAuth URL returned from Supabase');

        const result = await WebBrowser.openAuthSessionAsync(data.url, REDIRECT_URI, {
            showInRecents: false,
        });

        if (result.type === 'cancel') {
            return { session: null, cancelled: true };
        }

        if (result.type !== 'success') {
            return { session: null, cancelled: false };
        }

        const { accessToken, refreshToken, error: oauthError } = extractTokens(result.url);

        if (oauthError) {
            throw new Error(`OAuth error: ${oauthError}`);
        }

        if (accessToken && refreshToken) {
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
            });
            if (sessionError) throw sessionError;
            return { session: sessionData.session, cancelled: false };
        }

        // Fallback: auth state change listener may have already set the session
        const { data: currentSession } = await supabase.auth.getSession();
        return { session: currentSession.session, cancelled: false };
    },

    getSession: async () => {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        return data.session;
    },

    refreshSession: async () => {
        const { data, error } = await supabase.auth.refreshSession();
        if (error) throw error;
        return data.session;
    },

    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    onAuthStateChange: (callback: (session: any) => void) => {
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
            callback(session);
        });
        return data.subscription;
    },
};
