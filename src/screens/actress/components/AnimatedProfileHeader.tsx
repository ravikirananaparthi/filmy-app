import { FavlistButton } from '@components/common/FavlistButton';
import { Theme } from '@constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import {
    Pressable,
    StyleSheet,
    View
} from 'react-native';
import Animated, {
    interpolate,
    SharedValue,
    useAnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HEADER_HEIGHT = 56;

interface AnimatedProfileHeaderProps {
    actressId: string;
    actressName: string;
    coverImageUrl: string;
    scrollY: SharedValue<number>;
    heroHeight: number;
}

/**
 * Animated header for actress profile screen.
 * - Back button (left) - always visible with glass background
 * - Actress name (center) - fades in when hero scrolls up
 * - Heart icon (right) - toggles favorite state
 * - Background: blurred cover image that fades in on scroll
 * 
 * Uses React Native Reanimated for smooth animations.
 */
export default function AnimatedProfileHeader({
    actressId,
    actressName,
    coverImageUrl,
    scrollY,
    heroHeight,
}: AnimatedProfileHeaderProps) {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const handleBack = useCallback(() => {
        router.back();
    }, [router]);

    // Calculate scroll threshold - when hero is about to scroll out
    const scrollThreshold = heroHeight - HEADER_HEIGHT - insets.top - 20;

    // Background opacity - fades in as hero scrolls up
    const backgroundStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [scrollThreshold * 0.7, scrollThreshold],
            [0, 1],
            'clamp'
        );
        return { opacity };
    });

    // Status bar background - transparent initially, black when scrolled
    const statusBarStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [scrollThreshold * 0.7, scrollThreshold],
            [0, 1],
            'clamp'
        );
        return { backgroundColor: `rgba(0,0,0,${opacity})` };
    });

    // Title animation - fades in and slides up when header background appears
    const titleStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [scrollThreshold * 0.8, scrollThreshold],
            [0, 1],
            'clamp'
        );
        const translateY = interpolate(
            scrollY.value,
            [scrollThreshold * 0.8, scrollThreshold],
            [15, 0],
            'clamp'
        );
        return { opacity, transform: [{ translateY }] };
    });

    const totalHeaderHeight = HEADER_HEIGHT + insets.top;

    return (
        <View style={styles.container}>
            {/* Animated status bar - transparent initially, black when scrolled */}
            <Animated.View style={[styles.statusBar, { height: insets.top }, statusBarStyle]} />

            {/* Header content - below status bar */}
            <View style={styles.headerWrapper}>
                {/* Animated background with blurred cover image */}
                <Animated.View style={[styles.backgroundContainer, backgroundStyle]}>
                    <Image
                        source={{ uri: coverImageUrl }}
                        style={styles.backgroundImage}
                        contentFit="cover"
                        blurRadius={15}
                    />
                    <View style={styles.backgroundOverlay} />
                </Animated.View>

                {/* Header content */}
                <View style={styles.content}>
                    {/* Back button */}
                    <Pressable
                        onPress={handleBack}
                        style={({ pressed }) => [
                            styles.iconButton,
                            pressed && styles.iconButtonPressed,
                        ]}
                    >
                        <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
                    </Pressable>

                    {/* Actress name (animated) */}
                    <Animated.Text
                        style={[styles.title, titleStyle]}
                        numberOfLines={1}
                    >
                        {actressName}
                    </Animated.Text>

                    {/* Favlist button - uses Zustand store */}
                    <FavlistButton actressId={actressId} size={22} />
                </View>
            </View>
        </View>
    );
}

export { HEADER_HEIGHT };

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
    },
    statusBar: {
        // Background color is animated via statusBarStyle
    },
    headerWrapper: {
        height: HEADER_HEIGHT,
        overflow: 'hidden',
    },
    backgroundContainer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
    },
    backgroundOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Theme.spacing.sm,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconButtonPressed: {
        opacity: 0.7,
        transform: [{ scale: 0.95 }],
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
        marginHorizontal: Theme.spacing.sm,
    },
});

