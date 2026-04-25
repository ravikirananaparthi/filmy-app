import { Theme } from '@/constants/theme';
import { apiClient } from '@services/api/client';
import { API_ENDPOINTS } from '@services/api/endpoints';
import { authService } from '@services/auth.service';
import { useAuthStore } from '@store/slices/authSlice';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SignInScreen() {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const setSession = useAuthStore((s) => s.setSession);
    const setUser = useAuthStore((s) => s.setUser);

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);
        try {
            const { session, cancelled } = await authService.signInWithGoogle();

            if (cancelled) return;

            if (!session) {
                setError('Sign-in failed. Please try again.');
                return;
            }

            // 1. Store tokens so the API client can attach them to requests
            setSession(session.access_token, session.refresh_token);

            // 2. Call /auth/me — this auto-creates the user row in the DB for new
            //    Google accounts AND returns the full user object. Must succeed before
            //    navigating so every subsequent API call can pass the auth middleware.
            const { data: meRes } = await apiClient.get(API_ENDPOINTS.AUTH.ME);
            const dbUser = meRes?.data?.user ?? null;

            if (!dbUser) {
                setError('Could not create your profile. Please try again.');
                return;
            }

            // 3. Store user → also sets isAuthenticated: true
            setUser(dbUser);

            // 4. Navigate — AuthGuard now sees isAuthenticated: true and allows it
            router.replace('/(tabs)' as any);
        } catch (e: any) {
            console.error('[SignIn] Error:', e);
            setError(e?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom + 32, paddingTop: insets.top + 32 }]}>
            <StatusBar style="light" />

            {/* Logo / Brand section */}
            <View style={styles.brandSection}>
                <View style={styles.logoCircle}>
                    <Text style={styles.logoLetter}>F</Text>
                </View>
                <Text style={styles.appName}>Filmy</Text>
                <Text style={styles.tagline}>Discover beautiful images</Text>
            </View>

            {/* CTA section */}
            <View style={styles.ctaSection}>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <Pressable
                    style={({ pressed }) => [styles.googleButton, pressed && styles.googleButtonPressed]}
                    onPress={handleGoogleSignIn}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#000" size="small" />
                    ) : (
                        <>
                            <GoogleIcon />
                            <Text style={styles.googleButtonText}>Continue with Google</Text>
                        </>
                    )}
                </Pressable>

                <Text style={styles.disclaimer}>
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </Text>
            </View>
        </View>
    );
}

function GoogleIcon() {
    return (
        <View style={styles.googleIcon}>
            <Text style={styles.googleIconText}>G</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D0A12',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    brandSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: Theme.palette.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    logoLetter: {
        fontSize: 42,
        fontWeight: '700',
        color: '#fff',
        fontFamily: 'GoogleSansFlex_700Bold',
    },
    appName: {
        fontSize: 36,
        fontWeight: '700',
        color: '#fff',
        fontFamily: 'GoogleSansFlex_700Bold',
        letterSpacing: -0.5,
    },
    tagline: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.5)',
        fontFamily: 'GoogleSansFlex_400Regular',
    },
    ctaSection: {
        width: '100%',
        gap: 16,
        alignItems: 'center',
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'GoogleSansFlex_400Regular',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 100,
        width: '100%',
        height: 54,
        gap: 10,
    },
    googleButtonPressed: {
        opacity: 0.85,
    },
    googleIcon: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#4285F4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    googleIconText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 13,
    },
    googleButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111',
        fontFamily: 'GoogleSansFlex_600SemiBold',
    },
    disclaimer: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.3)',
        textAlign: 'center',
        lineHeight: 18,
        fontFamily: 'GoogleSansFlex_400Regular',
        paddingHorizontal: 16,
    },
});
