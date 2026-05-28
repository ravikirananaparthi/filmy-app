import { useRefreshContext } from '@/src/contexts/RefreshContext';
import { MasonryImageGrid } from '@components/common/MasonryImageGrid';
import { Theme } from '@constants/theme';
import useLike from '@hooks/useLike';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo } from 'react';
import {
    StatusBar,
    StyleSheet,
    View,
    useColorScheme,
} from 'react-native';
import { useMotionify } from 'react-native-motionify';

// Local components
import AnimatedHeader from './components/AnimatedHeader';

// Hooks
import { flattenForYouPages, useForYouFeed } from './hooks/useForYouFeed';

export default function HomeScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    // Scroll-driven animations hook
    const { onScroll } = useMotionify();

    // Refresh context for tab-triggered refresh
    const { isRefreshing, registerRefreshHandler } = useRefreshContext();

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

    // Register refresh handler for tab-triggered refresh
    useEffect(() => {
        registerRefreshHandler(refetch);
    }, [refetch, registerRefreshHandler]);

    // Flatten feed pages
    const feedData = useMemo(() => flattenForYouPages(data), [data]);

    // Handlers
    const handleImagePress = useCallback((imageId: string) => {
        router.push(`/image/${imageId}?source=home` as any);
    }, []);

    // Simplified: toggleLike now reads state from Zustand store
    const handleLike = useCallback((imageId: string) => {
        toggleLike(imageId);
    }, [toggleLike]);

    const handleSearchPress = useCallback(() => {
        router.push('/search' as any);
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

    // Combine refreshing states (pull-to-refresh OR tab-triggered)
    const isAnyRefreshing = isRefetching || isRefreshing;

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

            {/* Gmail-style Animated Header */}
            <AnimatedHeader onSearchPress={handleSearchPress} />

            {/* Optimized FlashList Masonry Grid with standard RefreshControl */}
            <MasonryImageGrid
                data={feedData}
                onLike={handleLike}
                onImagePress={handleImagePress}
                isLoading={isLoading}
                isRefreshing={isAnyRefreshing}
                onRefresh={handleRefresh}
                onEndReached={handleEndReached}
                onScroll={onScroll}
                ListHeaderComponent={ListHeader}
                contentContainerStyle={{ paddingTop: 140 }}
                hideActressName
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerSpacer: {
        height: 10,
    },
});
