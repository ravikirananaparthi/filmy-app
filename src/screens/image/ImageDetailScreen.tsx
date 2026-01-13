import { CarouselScreen } from '@/src/components/carousel';
import { Text } from '@/src/components/ui';
import { useActressProfile } from '@/src/screens/actress/hooks/useActressProfile';
import { flattenLikedPages, useLikedImages } from '@/src/screens/favorites/hooks';
import { flattenFolderPages, useFolderImages } from '@/src/screens/favorites/hooks/useFolderImages';
import { flattenForYouPages, useForYouFeed } from '@/src/screens/home/hooks/useForYouFeed';
import { flattenSearchPages, useUnifiedSearch } from '@/src/screens/search-input/hooks/useActressSearch';
import type { Image } from '@/src/types/image.types';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

type ImageSource = 'liked' | 'folder' | 'search' | 'actress' | 'home';

export default function ImageDetailScreen() {
    const { id, actressId, searchQuery, source, folderId } = useLocalSearchParams<{
        id: string;
        actressId?: string;
        searchQuery?: string;
        source?: ImageSource;
        folderId?: string;
    }>();

    // Determine the source of images
    const isFromLiked = source === 'liked';
    const isFromFolder = source === 'folder' && !!folderId;
    const isFromSearch = !!searchQuery;
    const isFromActressProfile = !!actressId;

    // Home feed hook - default source
    const homeFeed = useForYouFeed({ limit: 20 });

    // Actress feed hook
    const actressFeed = useActressProfile(actressId || '', {
        sortBy: 'popularity',
        enabled: isFromActressProfile,
    });

    // Search feed hook
    const searchFeed = useUnifiedSearch(searchQuery || '', { limit: 20 });

    // Liked images hook
    const likedFeed = useLikedImages({ limit: 20 });

    // Folder images hook
    const folderFeed = useFolderImages(folderId || '', { limit: 30 });

    // Get images from each source
    const likedImages: Image[] = useMemo(() => {
        return flattenLikedPages(likedFeed.data) as Image[];
    }, [likedFeed.data]);

    const folderImages: Image[] = useMemo(() => {
        return flattenFolderPages(folderFeed.data);
    }, [folderFeed.data]);

    const searchImages: Image[] = useMemo(() => {
        return flattenSearchPages(searchFeed.data).images;
    }, [searchFeed.data]);

    const actressImages: Image[] = useMemo(() => {
        if (!actressFeed.data?.pages) return [];
        return actressFeed.data.pages.flatMap(
            (page) => page.actress?.images || []
        ) as Image[];
    }, [actressFeed.data?.pages]);

    const homeFeedImages: Image[] = useMemo(() => {
        return flattenForYouPages(homeFeed.data);
    }, [homeFeed.data]);

    // Pick correct images based on source priority
    const allImages = useMemo(() => {
        if (isFromLiked && likedImages.length > 0) return likedImages;
        if (isFromFolder && folderImages.length > 0) return folderImages;
        if (isFromSearch && searchImages.length > 0) return searchImages;
        if (isFromActressProfile && actressImages.length > 0) return actressImages;
        return homeFeedImages;
    }, [isFromLiked, isFromFolder, isFromSearch, isFromActressProfile, likedImages, folderImages, searchImages, actressImages, homeFeedImages]);

    // Determine loading state
    const isLoading = useMemo(() => {
        if (isFromLiked) return likedFeed.isLoading || likedImages.length === 0;
        if (isFromFolder) return folderFeed.isLoading || folderImages.length === 0;
        if (isFromSearch) return searchFeed.isLoading || searchImages.length === 0;
        if (isFromActressProfile) return actressFeed.isLoading || actressImages.length === 0;
        return homeFeed.isLoading || homeFeedImages.length === 0;
    }, [
        isFromLiked, isFromFolder, isFromSearch, isFromActressProfile,
        likedFeed.isLoading, folderFeed.isLoading, searchFeed.isLoading, actressFeed.isLoading, homeFeed.isLoading,
        likedImages.length, folderImages.length, searchImages.length, actressImages.length, homeFeedImages.length,
    ]);

    // Pagination handlers
    const { handleFetchMore, hasMore, isFetchingMore } = useMemo(() => {
        if (isFromLiked) {
            return {
                handleFetchMore: likedFeed.fetchNextPage,
                hasMore: likedFeed.hasNextPage,
                isFetchingMore: likedFeed.isFetchingNextPage,
            };
        }
        if (isFromFolder) {
            // Folder uses traditional pagination, no infinite scroll in carousel
            return { handleFetchMore: undefined, hasMore: false, isFetchingMore: false };
        }
        if (isFromSearch) {
            return {
                handleFetchMore: searchFeed.fetchNextPage,
                hasMore: searchFeed.hasNextPage,
                isFetchingMore: searchFeed.isFetchingNextPage,
            };
        }
        if (isFromActressProfile) {
            return {
                handleFetchMore: actressFeed.fetchNextPage,
                hasMore: actressFeed.hasNextPage,
                isFetchingMore: actressFeed.isFetchingNextPage,
            };
        }
        return {
            handleFetchMore: homeFeed.fetchNextPage,
            hasMore: homeFeed.hasNextPage,
            isFetchingMore: homeFeed.isFetchingNextPage,
        };
    }, [
        isFromLiked, isFromFolder, isFromSearch, isFromActressProfile,
        likedFeed, searchFeed, actressFeed, homeFeed,
    ]);

    // Find initial index
    const initialIndex = useMemo(() => {
        const index = allImages.findIndex((img) => img.id === id);
        return index >= 0 ? index : 0;
    }, [allImages, id]);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.text}>Loading...</Text>
            </View>
        );
    }

    return (
        <CarouselScreen
            images={allImages}
            initialIndex={initialIndex}
            onFetchMore={handleFetchMore}
            hasMore={hasMore}
            isFetchingMore={isFetchingMore}
        />
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
    text: { color: '#fff', fontSize: 16, marginTop: 10 },
});
