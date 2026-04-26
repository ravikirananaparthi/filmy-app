import { CarouselScreen } from '@/src/components/carousel';
import { Text } from '@/src/components/ui';
import { useActressProfile } from '@/src/screens/actress/hooks/useActressProfile';
import { flattenLikedPages, useLikedImages } from '@/src/screens/favorites/hooks';
import { flattenFolderPages, useFolderImages } from '@/src/screens/favorites/hooks/useFolderImages';
import { flattenForYouPages, useForYouFeed } from '@/src/screens/home/hooks/useForYouFeed';
import { flattenSearchPages, useUnifiedSearch } from '@/src/screens/search-input/hooks/useActressSearch';
import { getImageDetail } from '@/src/services/api/image.service';
import type { Image } from '@/src/types/image.types';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

type ImageSource = 'liked' | 'folder' | 'search' | 'actress' | 'home';

export default function ImageDetailScreen() {
    const { id, profileId, searchQuery, source, folderId } = useLocalSearchParams<{
        id: string;
        profileId?: string;
        searchQuery?: string;
        source?: ImageSource;
        folderId?: string;
    }>();

    // Determine the source of images
    const isFromLiked = source === 'liked';
    const isFromFolder = source === 'folder' && !!folderId;
    const isFromSearch = !!searchQuery;
    const isFromProfile = !!profileId;
    const isFromHome = source === 'home' || (!isFromLiked && !isFromFolder && !isFromSearch && !isFromProfile);

    // Home feed hook - default source
    const homeFeed = useForYouFeed({ limit: 20, enabled: isFromHome });

    const imageDetail = useQuery({
        queryKey: ['images', id, 'detail'],
        queryFn: () => getImageDetail(id),
        enabled: !!id && !source && !searchQuery && !profileId && !folderId,
        staleTime: 1000 * 60 * 5,
    });

    // Profile feed hook
    const profileFeed = useActressProfile(profileId || '', {
        sortBy: 'popularity',
        enabled: isFromProfile,
    });

    // Search feed hook
    const searchFeed = useUnifiedSearch(searchQuery || '', { limit: 20, enabled: isFromSearch });

    // Liked images hook
    const likedFeed = useLikedImages({ limit: 20, enabled: isFromLiked });

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

    const profileImages: Image[] = useMemo(() => {
        if (!profileFeed.data?.pages) return [];
        return profileFeed.data.pages.flatMap(
            (page) => page.actress?.images || []
        ) as Image[];
    }, [profileFeed.data?.pages]);

    const homeFeedImages: Image[] = useMemo(() => {
        return flattenForYouPages(homeFeed.data);
    }, [homeFeed.data]);

    // Pick correct images based on source priority
    const allImages = useMemo(() => {
        if (isFromLiked && likedImages.length > 0) return likedImages;
        if (isFromFolder && folderImages.length > 0) return folderImages;
        if (isFromSearch && searchImages.length > 0) return searchImages;
        if (isFromProfile && profileImages.length > 0) return profileImages;
        return homeFeedImages;
    }, [isFromLiked, isFromFolder, isFromSearch, isFromProfile, likedImages, folderImages, searchImages, profileImages, homeFeedImages]);

    const displayImages = useMemo(() => {
        if (allImages.some((img) => img.id === id)) return allImages;
        if (imageDetail.data) return [imageDetail.data as Image];
        return allImages;
    }, [allImages, imageDetail.data, id]);

    // Determine loading state
    const isLoading = useMemo(() => {
        if (displayImages.length > 0) return false;
        if (isFromLiked) return likedFeed.isLoading || likedImages.length === 0;
        if (isFromFolder) return folderFeed.isLoading || folderImages.length === 0;
        if (isFromSearch) return searchFeed.isLoading || searchImages.length === 0;
        if (isFromProfile) return profileFeed.isLoading || profileImages.length === 0;
        return homeFeed.isLoading || imageDetail.isLoading || homeFeedImages.length === 0;
    }, [
        displayImages.length,
        isFromLiked, isFromFolder, isFromSearch, isFromProfile,
        likedFeed.isLoading, folderFeed.isLoading, searchFeed.isLoading, profileFeed.isLoading, homeFeed.isLoading, imageDetail.isLoading,
        likedImages.length, folderImages.length, searchImages.length, profileImages.length, homeFeedImages.length,
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
        if (isFromProfile) {
            return {
                handleFetchMore: profileFeed.fetchNextPage,
                hasMore: profileFeed.hasNextPage,
                isFetchingMore: profileFeed.isFetchingNextPage,
            };
        }
        return {
            handleFetchMore: homeFeed.fetchNextPage,
            hasMore: homeFeed.hasNextPage,
            isFetchingMore: homeFeed.isFetchingNextPage,
        };
    }, [
        isFromLiked, isFromFolder, isFromSearch, isFromProfile,
        likedFeed, searchFeed, profileFeed, homeFeed,
    ]);

    // Find initial index
    const initialIndex = useMemo(() => {
        const index = displayImages.findIndex((img) => img.id === id);
        return index >= 0 ? index : 0;
    }, [displayImages, id]);

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
            images={displayImages}
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
