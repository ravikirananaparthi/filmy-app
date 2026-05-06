import { apiClient } from '@services/api/client';
import { API_ENDPOINTS } from '@services/api/endpoints';
import { authService } from '@services/auth.service';
import { useAuthStore } from '@store/slices/authSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
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
import Svg, { Path, G, ClipPath, Rect, Defs } from 'react-native-svg';

function GoogleLogo({ size = 20 }: { size?: number }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Defs>
                <ClipPath id="clip">
                    <Rect width="24" height="24" />
                </ClipPath>
            </Defs>
            <G clipPath="url(#clip)">
                <Path
                    d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                    fill="#4285F4"
                />
                <Path
                    d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.615 24 12.255 24z"
                    fill="#34A853"
                />
                <Path
                    d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 0 0 0 10.76l3.98-3.09z"
                    fill="#FBBC05"
                />
                <Path
                    d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.64 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
                    fill="#EA4335"
                />
            </G>
        </Svg>
    );
}

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

            setSession(session.access_token, session.refresh_token);

            const { data: meRes } = await apiClient.get(API_ENDPOINTS.AUTH.ME);
            const dbUser = meRes?.data?.user ?? null;

            if (!dbUser) {
                setError('Could not create your profile. Please try again.');
                return;
            }

            setUser(dbUser);
            router.replace('/(tabs)' as any);
        } catch (e: any) {
            console.error('[SignIn] Error:', e);
            setError(e?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Full-screen background image */}
            <Image
                source={require('../../../assets/images/onboarding-bg.png')}
                style={StyleSheet.absoluteFillObject}
                contentFit="cover"
            />

            {/* Gradient: fades image into black at the bottom */}
            <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,1)']}
                locations={[0, 0.5, 1]}
                style={styles.gradient}
            />

            {/* Bottom CTA panel */}
            <View style={[styles.cta, { paddingBottom: insets.bottom + 28 }]}>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <Pressable
                    style={({ pressed }) => [
                        styles.googleButton,
                        pressed && styles.googleButtonPressed,
                    ]}
                    onPress={handleGoogleSignIn}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#444" size="small" />
                    ) : (
                        <>
                            <GoogleLogo size={20} />
                            <Text style={styles.googleButtonText}>Sign in with Google</Text>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },

    // Gradient bridge between image and black panel — starts transparent, ends solid black
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 420,
    },

    // Solid black bottom panel anchored at the bottom
    cta: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        paddingTop: 28,
        backgroundColor: '#000000',
        gap: 14,
        alignItems: 'center',
    },

    errorText: {
        color: '#FF6B6B',
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'GoogleSansFlex_400Regular',
    },

    // Google-branded white pill button
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 28,
        width: '100%',
        height: 52,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 4,
    },
    googleButtonPressed: {
        backgroundColor: '#f1f1f1',
    },
    googleButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1f1f1f',
        fontFamily: 'GoogleSansFlex_400Regular',
        letterSpacing: 0.15,
    },

    disclaimer: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.35)',
        textAlign: 'center',
        lineHeight: 17,
        fontFamily: 'GoogleSansFlex_400Regular',
        paddingHorizontal: 12,
    },
});
