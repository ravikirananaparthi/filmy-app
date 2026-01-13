import type { Image } from '@/src/types/image.types';
import { Theme } from '@constants/theme';
import { useDebouncePress } from '@hooks/useDebouncePress';
import { FlashList } from '@shopify/flash-list';
import { useLikesStore } from '@store/slices/likesSlice';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Dimensions, RefreshControl, StyleSheet, useColorScheme, View } from 'react-native';
import { EmptyState } from './EmptyState';
import { ImageCard } from './ImageCard';
import { ShimmerGrid } from './ShimmerPlaceholder';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NUM_COLUMNS = 2;
const HORIZONTAL_PADDING = 0;
const COLUMN_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2) / NUM_COLUMNS;

interface MasonryImageGridProps {
    data: Image[];
    onLike: (imageId: string) => void;
    onImagePress: (imageId: string) => void;
    isLoading?: boolean;
    isRefreshing?: boolean;
    onRefresh?: () => void;
    onEndReached?: () => void;
    ListHeaderComponent?: React.ReactElement | null;
    contentContainerStyle?: any;
    onScroll?: any;
    hideLikeButton?: boolean;
    hideActressName?: boolean;
}

/**
 * Masonry grid for displaying images
 * 
 * Note: Like state is managed by Zustand store (likesSlice)
 * This component initializes the store with API data
 */
export const MasonryImageGrid: React.FC<MasonryImageGridProps> = ({
    data,
    onLike,
    onImagePress,
    isLoading = false,
    isRefreshing = false,
    onRefresh,
    onEndReached,
    ListHeaderComponent,
    contentContainerStyle,
    onScroll,
    hideLikeButton = false,
    hideActressName = false,
}) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const initFromApiData = useLikesStore((state) => state.initFromApiData);

    const backgroundColor = isDark
        ? Theme.colors.background.dark
        : Theme.colors.background.light;

    // Initialize Zustand store with like states from API data
    useEffect(() => {
        if (data.length > 0) {
            initFromApiData(data);
        }
    }, [data, initFromApiData]);

    // Debounce image press to prevent double-tap navigation
    const debouncedImagePress = useDebouncePress(onImagePress);

    const renderItem = useCallback(
        ({ item }: { item: Image }) => {
            const actressName = item.actress?.name;

            return (
                <ImageCard
                    image={item}
                    actressName={actressName}
                    onLike={onLike}
                    onPress={debouncedImagePress}
                    columnWidth={COLUMN_WIDTH}
                    hideLikeButton={hideLikeButton}
                    hideActressName={hideActressName}
                />
            );
        },
        [onLike, debouncedImagePress, hideLikeButton, hideActressName]
    );

    const keyExtractor = useCallback((item: Image) => item.id, []);

    const refreshControl = useMemo(
        () =>
            onRefresh ? (
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={onRefresh}
                    tintColor={Theme.colors.primary.main}
                    colors={[Theme.colors.primary.main]}
                    progressBackgroundColor={backgroundColor}
                    progressViewOffset={140} // Push indicator below header
                />
            ) : undefined,
        [onRefresh, isRefreshing, backgroundColor]
    );

    if (isLoading && data.length === 0) {
        return <ShimmerGrid count={6} />;
    }

    if (!isLoading && data.length === 0) {
        return <EmptyState message="No images found" />;
    }

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <FlashList
                data={data}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                numColumns={NUM_COLUMNS}
                masonry
                drawDistance={400}
                optimizeItemArrangement
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                refreshControl={refreshControl}
                ListHeaderComponent={ListHeaderComponent}
                contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
                showsVerticalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
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
        paddingBottom: 100,
    },
});

export default MasonryImageGrid;
