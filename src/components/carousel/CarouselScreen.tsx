import { downloadImageToGallery } from '@/src/services/download.service';
import type { Image as ImageType } from '@/src/types/image.types';
import useLike from '@hooks/useLike';
import { useLikesStore } from '@store/slices/likesSlice';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, View, ViewToken } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SaveToFavoritesSheet, { SaveToFavoritesSheetRef } from '../sheets/SaveToFavoritesSheet';
import { BottomBar } from './BottomBar';
import { CarouselItem } from './CarouselItem';
import { MenuDropdown } from './MenuDropdown';
import { TopBar } from './TopBar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CarouselScreenProps {
    images: ImageType[];
    initialIndex: number;
    // Pagination props
    onFetchMore?: () => void;
    hasMore?: boolean;
    isFetchingMore?: boolean;
}

/**
 * CarouselScreen - Fullscreen image carousel with Pinterest-style swiping
 */
export function CarouselScreen({
    images,
    initialIndex,
    onFetchMore,
    hasMore,
    isFetchingMore,
}: CarouselScreenProps) {
    const flatListRef = useRef<FlatList<ImageType>>(null);
    const sheetRef = useRef<SaveToFavoritesSheetRef>(null);
    const [activeIndex, setActiveIndex] = useState(initialIndex);
    const [menuVisible, setMenuVisible] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const { toggleLike } = useLike();
    const initFromApiData = useLikesStore((state) => state.initFromApiData);

    // Initialize likes store
    useEffect(() => {
        if (images.length > 0) {
            initFromApiData(images);
        }
    }, [images, initFromApiData]);

    // Current image
    const currentImage = useMemo(() => images[activeIndex], [images, activeIndex]);

    // Handle viewable items change + pagination trigger
    const onViewableItemsChanged = useCallback(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems.length > 0 && viewableItems[0].index !== null) {
                const newIndex = viewableItems[0].index;
                setActiveIndex(newIndex);

                // Fetch more when 3 images from end
                const threshold = images.length - 3;
                if (newIndex >= threshold && hasMore && !isFetchingMore && onFetchMore) {
                    onFetchMore();
                }
            }
        },
        [images.length, hasMore, isFetchingMore, onFetchMore]
    );

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
        minimumViewTime: 0,
    }).current;

    // Simple back - just use router.back()
    const handleBackPress = useCallback(() => {
        router.back();
    }, []);

    // Open menu dropdown
    const handleMenuPress = useCallback(() => {
        setMenuVisible(true);
    }, []);

    // Close menu dropdown
    const handleCloseMenu = useCallback(() => {
        setMenuVisible(false);
    }, []);

    // Set as wallpaper handler - navigate to wallpaper screen
    const handleSetWallpaper = useCallback(() => {
        if (currentImage?.id) {
            router.navigate(`/wallpaper/${currentImage.id}` as any);
        }
    }, [currentImage?.id]);

    // Download handler
    const handleDownloadPress = useCallback(async () => {
        if (!currentImage || isDownloading) return;

        setIsDownloading(true);
        const actressName = currentImage.actress?.name;
        await downloadImageToGallery(currentImage.image_url, currentImage.id, actressName);
        setIsDownloading(false);
    }, [currentImage, isDownloading]);

    const handleLikePress = useCallback(
        (imageId: string) => {
            toggleLike(imageId);
        },
        [toggleLike]
    );

    const handleBookmarkPress = useCallback(() => {
        sheetRef.current?.present();
    }, []);

    const renderItem = useCallback(
        ({ item, index }: { item: ImageType; index: number }) => (
            <CarouselItem
                image={item}
                isActive={index === activeIndex}
            />
        ),
        [activeIndex]
    );

    const keyExtractor = useCallback((item: ImageType) => item.id, []);

    const getItemLayout = useCallback(
        (_: any, index: number) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
        }),
        []
    );

    const actressName = currentImage?.actress?.name || 'Unknown';

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.container}>
                <FlatList
                    ref={flatListRef}
                    data={images}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    initialScrollIndex={initialIndex}
                    getItemLayout={getItemLayout}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                    bounces={false}
                    snapToInterval={SCREEN_WIDTH}
                    snapToAlignment="start"
                    decelerationRate={0.9}
                    disableIntervalMomentum
                    removeClippedSubviews={false}
                    initialNumToRender={3}
                    maxToRenderPerBatch={2}
                    windowSize={5}
                />

                <TopBar onBackPress={handleBackPress} onMenuPress={handleMenuPress} />

                {currentImage && (
                    <BottomBar
                        actressName={actressName}
                        imageId={currentImage.id}
                        onDownloadPress={handleDownloadPress}
                        onBookmarkPress={handleBookmarkPress}
                        onLikePress={handleLikePress}
                    />
                )}

                {/* Menu Dropdown */}
                <MenuDropdown
                    visible={menuVisible}
                    onClose={handleCloseMenu}
                    onSetWallpaper={handleSetWallpaper}
                />

                {/* Save to Favorites Sheet */}
                <SaveToFavoritesSheet
                    ref={sheetRef}
                    imageId={currentImage?.id}
                    imageUrl={currentImage?.image_url}
                />
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
});

export default CarouselScreen;
