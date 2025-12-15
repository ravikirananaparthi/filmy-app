import type { Image } from '@/src/types/image.types';
import { Theme } from '@constants/theme';
import { MasonryFlashList } from '@shopify/flash-list';
import React, { useCallback, useMemo } from 'react';
import { Dimensions, RefreshControl, StyleSheet, useColorScheme, View } from 'react-native';
import { EmptyState } from './EmptyState';
import { ImageCard } from './ImageCard';
import { LoadingState } from './LoadingState';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NUM_COLUMNS = 2;
const HORIZONTAL_PADDING = 12;
const COLUMN_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2) / NUM_COLUMNS;

interface MasonryImageGridProps {
    data: Image[];
    actressNames?: Record<string, string>;
    likedImageIds: Set<string>;
    onLike: (imageId: string) => void;
    onImagePress: (imageId: string) => void;
    isLoading?: boolean;
    isRefreshing?: boolean;
    onRefresh?: () => void;
    onEndReached?: () => void;
    ListHeaderComponent?: React.ReactElement;
    contentContainerStyle?: object;
}

export const MasonryImageGrid: React.FC<MasonryImageGridProps> = ({
    data,
    actressNames = {},
    likedImageIds,
    onLike,
    onImagePress,
    isLoading = false,
    isRefreshing = false,
    onRefresh,
    onEndReached,
    ListHeaderComponent,
    contentContainerStyle,
}) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const backgroundColor = isDark
        ? Theme.colors.background.dark
        : Theme.colors.background.light;

    const renderItem = useCallback(
        ({ item }: { item: Image }) => {
            const isLiked = likedImageIds.has(item.id);
            const actressName = actressNames[item.actress_id];

            return (
                <ImageCard
                    image={item}
                    actressName={actressName}
                    isLiked={isLiked}
                    onLike={onLike}
                    onPress={onImagePress}
                    columnWidth={COLUMN_WIDTH}
                />
            );
        },
        [likedImageIds, actressNames, onLike, onImagePress]
    );

    const keyExtractor = useCallback((item: Image) => item.id, []);

    // Optimized settings for masonry
    const overrideItemLayout = useCallback(
        (layout: { span?: number; size?: number }, item: Image) => {
            // Calculate height based on aspect ratio for smoother layout
            const height = COLUMN_WIDTH / (item.aspect_ratio || 0.75) + 50; // +50 for actress name
            layout.size = height;
        },
        []
    );

    const refreshControl = useMemo(
        () =>
            onRefresh ? (
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={onRefresh}
                    tintColor={Theme.colors.primary.main}
                    colors={[Theme.colors.primary.main]}
                    progressBackgroundColor={backgroundColor}
                />
            ) : undefined,
        [onRefresh, isRefreshing, backgroundColor]
    );

    if (isLoading && data.length === 0) {
        return <LoadingState />;
    }

    if (!isLoading && data.length === 0) {
        return <EmptyState message="No images found" />;
    }

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <MasonryFlashList
                data={data}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                numColumns={NUM_COLUMNS}
                estimatedItemSize={250}
                overrideItemLayout={overrideItemLayout}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                refreshControl={refreshControl}
                ListHeaderComponent={ListHeaderComponent}
                contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
                showsVerticalScrollIndicator={false}
                drawDistance={SCREEN_WIDTH * 2}
                optimizeItemArrangement
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: HORIZONTAL_PADDING,
        paddingBottom: 100, // Space for tab bar
    },
});

export default MasonryImageGrid;
