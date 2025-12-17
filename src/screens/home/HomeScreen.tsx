import { MasonryImageGrid } from '@components/common/MasonryImageGrid';
import { Theme } from '@constants/theme';
import { useFavoritesStore } from '@store/slices/favoritesSlice';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
    StatusBar,
    StyleSheet,
    View,
    useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Local components
import AppLogo from './components/AppLogo';
import FilterBottomSheet from './components/FilterBottomSheet';
import FilterChipsRow from './components/FilterChipsRow';
import SearchBarSkeleton from './components/SearchBarSkeleton';
import SortBottomSheet from './components/SortBottomSheet';

// Hooks
import useLike from '@hooks/useLike';
import usePopularTags from '@hooks/usePopularTags';
import { flattenFeedPages, useFeed } from './hooks/useFeed';
import { SORT_OPTIONS, useFilters } from './hooks/useFilters';

export default function HomeScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const insets = useSafeAreaInsets();

    // Filter state
    const {
        selectedTags,
        sortBy,
        minHotness,
        maxHotness,
        toggleTag,
        setTags,
        setSortBy,
        clearFilters,
    } = useFilters();

    // Bottom sheet state
    const [showSortSheet, setShowSortSheet] = useState(false);
    const [showFilterSheet, setShowFilterSheet] = useState(false);

    // Data hooks
    const {
        data,
        isLoading,
        isRefetching,
        fetchNextPage,
        hasNextPage,
        refetch,
    } = useFeed({
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        sortBy,
        minHotness,
        maxHotness,
    });

    const { data: popularTags = [] } = usePopularTags(15);
    const { toggleLike, isPending: isLikePending, isImageFavorited } = useLike();
    const favoriteImageIds = useFavoritesStore((s) => s.favoriteImageIds);

    // Flatten feed pages
    const feedData = useMemo(() => flattenFeedPages(data), [data]);

    // Extract actress names from feed
    const actressNames = useMemo(() => {
        const names: Record<string, string> = {};
        feedData.forEach((image: any) => {
            if (image.actress && image.actress.name) {
                names[image.actress_id] = image.actress.name;
            }
        });
        return names;
    }, [feedData]);

    // Handlers
    const handleImagePress = useCallback((imageId: string) => {
        router.push(`/image/${imageId}`);
    }, []);

    const handleSearchPress = useCallback(() => {
        router.push('/(tabs)/search');
    }, []);

    const handleBlendPress = useCallback(() => {
        // TODO: Navigate to blend screen
        console.log('Navigate to blend screen');
    }, []);

    const handleEndReached = useCallback(() => {
        if (hasNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, fetchNextPage]);

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    const handleSortSelect = useCallback((sort: typeof sortBy) => {
        setSortBy(sort);
    }, [setSortBy]);

    const handleFilterApply = useCallback((tags: string[]) => {
        setTags(tags);
    }, [setTags]);

    // Get current sort label
    const sortLabel = useMemo(() => {
        const option = SORT_OPTIONS.find((o) => o.value === sortBy);
        return option?.label.split(' ')[1] || 'Popular'; // Get second word
    }, [sortBy]);

    const backgroundColor = isDark
        ? Theme.colors.background.dark
        : Theme.colors.background.light;

    // Header component for FlashList
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
                {/* Logo Row */}
                <View style={styles.logoRow}>
                    <AppLogo size="medium" />
                </View>

                {/* Search Bar */}
                <SearchBarSkeleton
                    onPress={handleSearchPress}
                    onBlendPress={handleBlendPress}
                />

                {/* Filter Chips */}
                <FilterChipsRow
                    selectedTags={selectedTags}
                    onFilterPress={() => setShowFilterSheet(true)}
                    onSortPress={() => setShowSortSheet(true)}
                    onTagToggle={toggleTag}
                    popularTags={popularTags}
                    sortLabel={sortLabel}
                />

                {/* Bottom border/shadow for sticky effect */}
                <View style={[styles.headerBorder, {
                    backgroundColor: isDark
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(0,0,0,0.03)'
                }]} />
            </View>

            {/* Masonry Image Grid */}
            <MasonryImageGrid
                data={feedData}
                actressNames={actressNames}
                likedImageIds={favoriteImageIds}
                onLike={toggleLike}
                onImagePress={handleImagePress}
                isLoading={isLoading}
                isRefreshing={isRefetching}
                isLikePending={isLikePending}
                onRefresh={handleRefresh}
                onEndReached={handleEndReached}
                ListHeaderComponent={ListHeader}
                contentContainerStyle={{ paddingTop: 180 }} // Space for sticky header
            />

            {/* Sort Bottom Sheet */}
            <SortBottomSheet
                isVisible={showSortSheet}
                onClose={() => setShowSortSheet(false)}
                selectedSort={sortBy}
                onSelect={handleSortSelect}
            />

            {/* Filter Bottom Sheet */}
            <FilterBottomSheet
                isVisible={showFilterSheet}
                onClose={() => setShowFilterSheet(false)}
                selectedTags={selectedTags}
                availableTags={popularTags}
                onApply={handleFilterApply}
                onClear={clearFilters}
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
        paddingBottom: 4,
    },
    headerBorder: {
        height: 1,
        marginTop: 14,
    },
    headerSpacer: {
        height: 10,
    },
});
