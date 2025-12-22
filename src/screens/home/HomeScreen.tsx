import { MasonryImageGrid } from '@components/common/MasonryImageGrid';
import { Theme } from '@constants/theme';
import useLike from '@hooks/useLike';
import { router } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import {
    StatusBar,
    StyleSheet,
    View,
    useColorScheme,
} from 'react-native';
import { MotionifyView } from 'react-native-motionify';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Local components
import AppLogo from './components/AppLogo';
import SearchBarSkeleton from './components/SearchBarSkeleton';

// Hooks
import { flattenForYouPages, useForYouFeed } from './hooks/useForYouFeed';

export default function HomeScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const insets = useSafeAreaInsets();

    // Data hooks
    const {
        data,
        isLoading,
        isRefetching,
        fetchNextPage,
        hasNextPage,
        refetch,
    } = useForYouFeed({ limit: 20 });

    const { toggleLike } = useLike();

    // Flatten feed pages
    const feedData = useMemo(() => flattenForYouPages(data), [data]);

    // Handlers
    const handleImagePress = useCallback((imageId: string) => {
        router.push(`/image/${imageId}`);
    }, []);

    // Simplified: toggleLike now reads state from Zustand store
    const handleLike = useCallback((imageId: string) => {
        toggleLike(imageId);
    }, [toggleLike]);

    const handleSearchPress = useCallback(() => {
        router.push('/(tabs)/search');
    }, []);

    const handleEndReached = useCallback(() => {
        if (hasNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, fetchNextPage]);

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    const backgroundColor = isDark
        ? Theme.colors.background.dark
        : Theme.colors.background.light;

    // Header component for FlashList padding
    const ListHeader = useMemo(
        () => (
            <View style={styles.headerSpacer}>
                {/* Spacer for sticky header */}
            </View>
        ),
        []
    );

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundColor}
            />

            {/* Sticky Header */}
            <View
                style={[
                    styles.stickyHeader,
                    {
                        backgroundColor,
                        paddingTop: insets.top,
                    },
                ]}
            >
                {/* Logo Row - Animates on scroll */}
                <MotionifyView
                    animatedY
                    hideOn="down"
                    translateRange={{ from: 0, to: -60 }}
                    animationDuration={200}
                    style={styles.logoRow}
                >
                    <AppLogo size="medium" />
                </MotionifyView>

                {/* Search Bar - Always Sticky */}
                <View style={styles.searchBarContainer}>
                    <SearchBarSkeleton onPress={handleSearchPress} />
                </View>

                {/* Bottom border for sticky effect */}
                <View style={[styles.headerBorder, {
                    backgroundColor: isDark
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(0,0,0,0.03)'
                }]} />
            </View>

            {/* Optimized FlashList Masonry Grid */}
            <MasonryImageGrid
                data={feedData}
                onLike={handleLike}
                onImagePress={handleImagePress}
                isLoading={isLoading}
                isRefreshing={isRefetching}
                onRefresh={handleRefresh}
                onEndReached={handleEndReached}
                ListHeaderComponent={ListHeader}
                contentContainerStyle={{ paddingTop: 140 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    stickyHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
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
    headerSpacer: {
        height: 10,
    },
});
