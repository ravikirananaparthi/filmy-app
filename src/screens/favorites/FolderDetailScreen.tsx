import { FontFamily } from '@/constants/theme';
import MasonryImageGrid from '@/src/components/common/MasonryImageGrid';
import { ShimmerGrid } from '@/src/components/common/ShimmerPlaceholder';
import { Text } from '@/src/components/ui';
import { Ionicons } from '@expo/vector-icons';
import useLike from '@hooks/useLike';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import {
    Pressable,
    StatusBar,
    StyleSheet,
    View,
    useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { flattenFolderPages, useFolderImages } from './hooks/useFolderImages';

/**
 * Screen showing images in a specific folder
 */
export default function FolderDetailScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const insets = useSafeAreaInsets();
    const { toggleLike } = useLike();

    const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();

    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isRefetching,
    } = useFolderImages(id, { limit: 20 });

    const images = useMemo(() => flattenFolderPages(data), [data]);
    const folderName = name ? decodeURIComponent(name) : 'Folder';

    const backgroundColor = isDark ? '#000000' : '#F5F5F5';
    const textColor = isDark ? '#FFFFFF' : '#000000';

    const handleBack = useCallback(() => {
        router.back();
    }, []);

    const handleImagePress = useCallback((imageId: string) => {
        // Navigate with source=folder so carousel only shows folder images
        router.push(`/image/${imageId}?source=folder&folderId=${id}`);
    }, [id]);

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
                <Text style={[styles.headerTitle, { color: textColor }]} numberOfLines={1}>
                    {folderName}
                </Text>
                <View style={styles.placeholder} />
            </View>

            {/* Content */}
            {isLoading && images.length === 0 ? (
                <ShimmerGrid count={6} />
            ) : images.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="images-outline" size={64} color={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'} />
                    <Text style={[styles.emptyText, { color: textColor }]}>No images in this folder</Text>
                </View>
            ) : (
                <MasonryImageGrid
                    data={images}
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
        flex: 1,
        fontSize: 18,
        fontFamily: FontFamily.semibold,
        textAlign: 'center',
        marginHorizontal: 8,
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
});
