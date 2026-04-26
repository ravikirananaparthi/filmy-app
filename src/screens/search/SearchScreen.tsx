import { MasonryImageGrid } from '@components/common/MasonryImageGrid';
import { ShimmerActressesRow, ShimmerHighlightsCarousel } from '@components/common/ShimmerPlaceholder';
import { useDebouncePress } from '@hooks/useDebouncePress';
import { useLike } from '@hooks/useLike';
import { router } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { StatusBar, StyleSheet, View, useColorScheme } from 'react-native';
import { useMotionify } from 'react-native-motionify';

import {
    ExploreHeader,
    FeaturedActressesRow,
    HighlightsCarousel,
    SectionHeader,
    TagsGrid,
    TrendingPreview,
    type ProfileItem,
    type HighlightItem,
} from './components';
import {
    useDiscoverImages,
    useFeaturedActresses,
    useHighlights,
    usePopularTags,
    useTrendingPreview,
} from './hooks';
import type { Tag } from '@services/api/tags.service';

export default function SearchScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const backgroundColor = isDark ? '#000000' : '#FFFFFF';

    const { onScroll } = useMotionify();

    const { data: highlightsData, isLoading: highlightsLoading } = useHighlights();
    const { data: profilesData, isLoading: profilesLoading } = useFeaturedActresses();
    const { data: trendingImages = [] } = useTrendingPreview();
    const { data: popularTags = [] } = usePopularTags();
    const {
        data: discoverData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useDiscoverImages();

    const { toggleLike } = useLike();

    const highlights: HighlightItem[] = useMemo(() => {
        if (!highlightsData?.images) return [];
        return highlightsData.images.map((img) => ({
            id: img.id,
            imageUrl: img.imageUrl,
            name: img.actress.name,
            caption: `${img.likesCount} likes`,
        }));
    }, [highlightsData]);

    const profiles: ProfileItem[] = useMemo(() => {
        if (!profilesData?.actresses) return [];
        return profilesData.actresses.map((a) => ({
            id: a.id,
            imageUrl: a.coverImageUrl,
            name: a.name,
        }));
    }, [profilesData]);

    const discoverImages = useMemo(
        () => discoverData?.pages.flatMap((p) => p.data) ?? [],
        [discoverData]
    );

    const handleSearchPress = useCallback(() => router.push('/search'), []);

    const handleHighlightPress = useCallback(
        (item: HighlightItem) => router.push(`/image/${item.id}` as any),
        []
    );

    const handleProfilePressRaw = useCallback(
        (item: ProfileItem) => router.push(`/actress/${item.id}` as any),
        []
    );
    const handleProfilePress = useDebouncePress(handleProfilePressRaw);

    const handleTagPress = useCallback((tag: Tag) => {
        router.push(`/search?tag=${encodeURIComponent(tag.name)}` as any);
    }, []);

    const handleImagePress = useCallback(
        (imageId: string) => router.push(`/image/${imageId}` as any),
        []
    );

    const handleLoadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const ListHeader = useMemo(
        () => (
            <View style={{ backgroundColor }}>
                <SectionHeader title="Highlights" subtitle="Trending celebrity moments" />
                {highlightsLoading ? (
                    <ShimmerHighlightsCarousel />
                ) : highlights.length > 0 ? (
                    <HighlightsCarousel data={highlights} onItemPress={handleHighlightPress} />
                ) : null}

                <SectionHeader
                    title="Featured"
                    subtitle="Popular profiles curated for you"
                    onPress={() => router.push('/actresses' as any)}
                />
                {profilesLoading ? (
                    <ShimmerActressesRow />
                ) : profiles.length > 0 ? (
                    <FeaturedActressesRow data={profiles} onItemPress={handleProfilePress} />
                ) : null}

                {trendingImages.length > 0 && (
                    <>
                        <SectionHeader title="Trending This Week" subtitle="Most liked in the last 7 days" />
                        <TrendingPreview images={trendingImages} />
                    </>
                )}

                {popularTags.length > 0 && (
                    <>
                        <SectionHeader title="Browse by Mood" />
                        <TagsGrid tags={popularTags} onTagPress={handleTagPress} />
                    </>
                )}

                <SectionHeader title="Discover" subtitle="Fresh picks just for you" />
            </View>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [backgroundColor, highlights, highlightsLoading, profiles, profilesLoading, trendingImages, popularTags]
    );

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <StatusBar animated barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={backgroundColor} />
            <ExploreHeader onSearchPress={handleSearchPress} />
            <MasonryImageGrid
                data={discoverImages}
                onLike={toggleLike}
                onImagePress={handleImagePress}
                onEndReached={handleLoadMore}
                ListHeaderComponent={ListHeader}
                onScroll={onScroll}
                hideActressName={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
});
