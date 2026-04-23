import { supabase } from '@config/supabase';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const getRedirectUri = () =>
    makeRedirectUri({
        scheme: 'filmyapp',
        path: 'auth/callback',
    });

export const authService = {
    signInWithGoogle: async () => {
        const redirectTo = getRedirectUri();

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
                skipBrowserRedirect: true,
            },
        });

        if (error) throw error;
        if (!data.url) throw new Error('No OAuth URL returned');

        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo, {
            showInRecents: false,
        });

        if (result.type !== 'success') {
            return { session: null, cancelled: result.type === 'cancel' };
        }

        // Extract tokens from the callback URL
        const url = result.url;
        const params = new URLSearchParams(url.split('#')[1] || url.split('?')[1] || '');
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken && refreshToken) {
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
            });
            if (sessionError) throw sessionError;
            return { session: sessionData.session, cancelled: false };
        }

        // Fallback: check existing session (deep link may have already set it)
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
