/**
 * OAuth callback landing screen — filmyapp://auth/callback
 *
 * Expo Router navigates here when the deep link arrives from the browser after
 * Google OAuth. We show an invisible loading screen so there is no "Unmatched
 * Route" flash. WebBrowser.maybeCompleteAuthSession() signals expo-web-browser
 * that the session is complete, which resolves the openAuthSessionAsync promise
 * back in auth.service.ts and lets SignInScreen finish the login flow.
 */

import { useAuthStore } from '@store/slices/authSlice';
import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

// Must be called in the component that renders at the redirect URI path.
WebBrowser.maybeCompleteAuthSession();

export default function AuthCallback() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

    useEffect(() => {
        // In the rare case the session resolves before SignInScreen can navigate,
        // we redirect here as a safety net.
        if (isAuthenticated) {
            router.replace('/(tabs)' as any);
        }
    }, [isAuthenticated]);

    // Render a blank screen matching the sign-in background — completely invisible
    // to the user. SignInScreen's router.replace('/(tabs)') takes over imminently.
    return <View style={styles.container} />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D0A12',
    },
});
