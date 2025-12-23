import { Theme } from '@constants/theme';
import React from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import { useMotionify } from 'react-native-motionify';
import Animated, {
    Easing,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppLogo from './AppLogo';
import SearchBarSkeleton from './SearchBarSkeleton';

const LOGO_HEIGHT = 48;
const ANIMATION_DURATION = 200;

interface AnimatedHeaderProps {
    onSearchPress: () => void;
}

/**
 * Gmail-style animated header with direction-based scroll animations.
 * Uses directionShared for proper show on scroll up, hide on scroll down.
 * 
 * - Logo: Slides up and fades when scrolling down, returns on scroll up
 * - Search bar: Slides up to fill logo space on scroll down
 * - Operates independently from the scroll list
 */
export default function AnimatedHeader({ onSearchPress }: AnimatedHeaderProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const insets = useSafeAreaInsets();
    const { directionShared } = useMotionify();

    const backgroundColor = isDark
        ? Theme.colors.background.dark
        : Theme.colors.background.light;

    const timingConfig = {
        duration: ANIMATION_DURATION,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    };

    // Logo animation: hide on scroll down, show on scroll up
    const logoAnimatedStyle = useAnimatedStyle(() => {
        const isScrollingDown = directionShared.value === 'down';
        const translateY = withTiming(isScrollingDown ? -LOGO_HEIGHT : 0, timingConfig);
        const opacity = withTiming(isScrollingDown ? 0 : 1, timingConfig);

        return {
            transform: [{ translateY }],
            opacity,
        };
    });

    // Search bar animation: slide up on scroll down, return on scroll up
    const searchBarAnimatedStyle = useAnimatedStyle(() => {
        const isScrollingDown = directionShared.value === 'down';
        const translateY = withTiming(isScrollingDown ? -LOGO_HEIGHT : 0, timingConfig);

        return {
            transform: [{ translateY }],
        };
    });

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Safe area background */}
            <View style={[styles.safeAreaBackground, { height: insets.top, backgroundColor }]} />

            {/* Logo - Gmail-style direction-based animation */}
            <View style={[styles.logoClipContainer, { backgroundColor }]}>
                <Animated.View style={[styles.logoRow, logoAnimatedStyle, { backgroundColor }]}>
                    <AppLogo size="medium" />
                </Animated.View>
            </View>

            {/* Search Bar - Slides up to fill logo space */}
            <Animated.View style={[searchBarAnimatedStyle, { backgroundColor }]}>
                <View style={styles.searchBarContainer}>
                    <SearchBarSkeleton onPress={onSearchPress} />
                </View>

                {/* Bottom border */}
                <View style={[styles.headerBorder, {
                    backgroundColor: isDark
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(0,0,0,0.03)'
                }]} />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
    },
    safeAreaBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    logoClipContainer: {
        overflow: 'hidden',
        height: LOGO_HEIGHT,
    },
    logoRow: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 8,
    },
    searchBarContainer: {
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    headerBorder: {
        height: 1,
    },
});
