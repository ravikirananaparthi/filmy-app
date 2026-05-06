import { MasonryImageGrid } from '@components/common/MasonryImageGrid';
import { ShimmerActressesRow, ShimmerBannerCarousel } from '@components/common/ShimmerPlaceholder';
import { useDebouncePress } from '@hooks/useDebouncePress';
import { useLike } from '@hooks/useLike';
import { router } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { StatusBar, StyleSheet, View, useColorScheme } from 'react-native';
import { useMotionify } from 'react-native-motionify';

import {
    BannerCarousel,
    ExploreHeader,
    FeaturedActressesRow,
    SectionHeader,
    TagsGrid,
    TrendingPreview,
    type BannerItem,
    type ProfileItem,
} from './components';
import {
    useDiscoverImages,
    useFeaturedActresses,
    useHighlights,
    useTagsWithPreviews,
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
    const { data: tagsWithPreviews = [] } = useTagsWithPreviews();
    const {
        data: discoverData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: discoverLoading,
    } = useDiscoverImages();

    const { toggleLike } = useLike();

    // Map highlights → BannerItem shape (no subtitle — keep the banner clean)
    const bannerItems: BannerItem[] = useMemo(() => {
        if (!highlightsData?.images) return [];
        return highlightsData.images.map((img) => ({
            id: img.id,
            imageUrl: img.imageUrl,
            title: img.actress.name,
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

    const handleBannerPress = useCallback(
        (item: BannerItem) => router.push(`/image/${item.id}` as any),
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
                {/* ── Hero banner (replaces HighlightsCarousel) ─────────── */}
                {highlightsLoading ? (
                    <ShimmerBannerCarousel />
                ) : bannerItems.length > 0 ? (
                    <BannerCarousel
                        data={bannerItems}
                        onItemPress={handleBannerPress}
                    />
                ) : null}

                {/* ── Featured creators ─────────────────────────────────── */}
                <SectionHeader
                    title="Featured"
                    subtitle="Popular creators for you"
                />
                {profilesLoading ? (
                    <ShimmerActressesRow />
                ) : profiles.length > 0 ? (
                    <FeaturedActressesRow data={profiles} onItemPress={handleProfilePress} />
                ) : null}

                {/* ── Trending this week ────────────────────────────────── */}
                {trendingImages.length > 0 && (
                    <>
                        <SectionHeader title="Trending This Week" subtitle="Most liked in the last 7 days" />
                        <TrendingPreview images={trendingImages} />
                    </>
                )}

                {/* ── Browse by mood / tags ─────────────────────────────── */}
                {tagsWithPreviews.length > 0 && (
                    <>
                        <SectionHeader title="Browse by Mood" />
                        <TagsGrid tags={tagsWithPreviews} onTagPress={handleTagPress} />
                    </>
                )}

                <SectionHeader title="Discover" subtitle="Fresh picks just for you" />
            </View>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [backgroundColor, bannerItems, highlightsLoading, profiles, profilesLoading, trendingImages, tagsWithPreviews]
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
                isLoading={discoverLoading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
});
