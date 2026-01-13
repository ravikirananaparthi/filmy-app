import { FontFamily } from '@/constants/theme';
import MasonryImageGrid from '@/src/components/common/MasonryImageGrid';
import { ShimmerGrid } from '@/src/components/common/ShimmerPlaceholder';
import { Text } from '@/src/components/ui';
import type { Image } from '@/src/types/image.types';
import { Ionicons } from '@expo/vector-icons';
import useLike from '@hooks/useLike';
import { router } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import {
    Pressable,
    StatusBar,
    StyleSheet,
    View,
    useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { flattenLikedPages, useLikedImages } from './hooks';

/**
 * Screen showing all liked images with masonry grid
 * Carousel only shows liked images when tapping an image
 */
export default function LikedImagesScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const insets = useSafeAreaInsets();
    const { toggleLike } = useLike();

    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isRefetching,
    } = useLikedImages({ limit: 20 });

    const images = useMemo(() => flattenLikedPages(data), [data]);

    const backgroundColor = isDark ? '#000000' : '#F5F5F5';
    const textColor = isDark ? '#FFFFFF' : '#000000';

    const handleBack = useCallback(() => {
        router.back();
    }, []);

    const handleImagePress = useCallback((imageId: string) => {
        // Navigate with source=liked so carousel only shows liked images
        router.push(`/image/${imageId}?source=liked`);
    }, []);

    const handleLike = useCallback((imageId: string) => {
        toggleLike(imageId);
    }, [toggleLike]);

    const handleEndReached = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <View style={[styles.container, { backgroundColor, paddingTop: insets.top }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={backgroundColor} />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={textColor} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: textColor }]}>Liked</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Content */}
            {isLoading && images.length === 0 ? (
                <ShimmerGrid count={6} />
            ) : images.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="heart-outline" size={64} color={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'} />
                    <Text style={[styles.emptyText, { color: textColor }]}>No liked images yet</Text>
                    <Text style={[styles.emptySubtext, { color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }]}>
                        Tap the heart on any image to add it here
                    </Text>
                </View>
            ) : (
                <MasonryImageGrid
                    data={images as Image[]}
                    onLike={handleLike}
                    onImagePress={handleImagePress}
                    onEndReached={handleEndReached}
                    isLoading={isFetchingNextPage}
                    isRefreshing={isRefetching}
                    onRefresh={refetch}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: FontFamily.semibold,
    },
    placeholder: {
        width: 32,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        gap: 12,
    },
    emptyText: {
        fontSize: 18,
        fontFamily: FontFamily.semibold,
        marginTop: 8,
    },
    emptySubtext: {
        fontSize: 14,
        fontFamily: FontFamily.regular,
        textAlign: 'center',
    },
});
