import { router } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    View,
    useColorScheme,
} from 'react-native';
import { useMotionify } from 'react-native-motionify';
import Animated from 'react-native-reanimated';

// Local components
import {
    ExploreHeader,
    FeaturedActressesRow,
    HighlightsCarousel,
    SectionHeader,
    type ActressItem,
    type HighlightItem,
} from './components';

// Hooks
import { useFeaturedActresses, useHighlights } from './hooks';

/**
 * Explore Screen (Search Tab)
 * Apple TV / Apple Movies style premium UI.
 * Supports both dark and light modes.
 */
export default function SearchScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const backgroundColor = isDark ? '#000000' : '#FFFFFF';

    // Scroll-driven animations hook (for bottom tab collapse)
    const { onScroll } = useMotionify();

    // Fetch data from API
    const { data: highlightsData, isLoading: highlightsLoading } = useHighlights();
    const { data: actressesData, isLoading: actressesLoading } = useFeaturedActresses();

    // Transform API data to component format
    const highlights: HighlightItem[] = useMemo(() => {
        if (!highlightsData?.images) return [];
        return highlightsData.images.map((image) => ({
            id: image.id,
            imageUrl: image.imageUrl,
            name: image.actress.name,
            caption: `${image.likesCount} likes`,
        }));
    }, [highlightsData]);

    const actresses: ActressItem[] = useMemo(() => {
        if (!actressesData?.actresses) return [];
        return actressesData.actresses.map((actress) => ({
            id: actress.id,
            imageUrl: actress.coverImageUrl,
            name: actress.name,
        }));
    }, [actressesData]);

    // Handlers
    const handleSearchPress = useCallback(() => {
        // TODO: Navigate to search input screen
        console.log('Search pressed');
    }, []);

    const handleHighlightPress = useCallback((item: HighlightItem) => {
        router.push(`/image/${item.id}`);
    }, []);

    const handleActressPress = useCallback((item: ActressItem) => {
        router.push(`/actress/${item.id}` as any);
    }, []);

    const handleSeeAllHighlights = useCallback(() => {
        // TODO: Navigate to all highlights
        console.log('See all highlights');
    }, []);

    const handleSeeAllActresses = useCallback(() => {
        // Navigate to actresses list
        router.push('/actresses' as any);
    }, []);

    const isLoading = highlightsLoading || actressesLoading;

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <StatusBar
                animated={true}
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundColor}
            />

            {/* Static Header */}
            <ExploreHeader onSearchPress={handleSearchPress} />

            {/* Scrollable Content with motionify scroll handler */}
            <Animated.ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
            >
                {/* Section 1: Highlights */}
                <SectionHeader
                    title="Highlights"
                    subtitle="Discover trending celebrity moments"
                    onPress={handleSeeAllHighlights}
                />
                {highlightsLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={isDark ? '#fff' : '#000'} />
                    </View>
                ) : highlights.length > 0 ? (
                    <HighlightsCarousel
                        data={highlights}
                        onItemPress={handleHighlightPress}
                    />
                ) : null}

                {/* Section 2: Featured Actresses */}
                <SectionHeader
                    title="Featured Actresses"
                    subtitle="Popular actresses wallpapers curated for you"
                    onPress={handleSeeAllActresses}
                />
                {actressesLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={isDark ? '#fff' : '#000'} />
                    </View>
                ) : actresses.length > 0 ? (
                    <FeaturedActressesRow
                        data={actresses}
                        onItemPress={handleActressPress}
                    />
                ) : null}

                {/* Bottom padding for tab bar */}
                <View style={styles.bottomPadding} />
            </Animated.ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    loadingContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomPadding: {
        height: 100, // Space for floating tab bar
    },
});

