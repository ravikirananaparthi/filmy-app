import type { Image as ImageType } from '@/src/types/image.types';
import React, { memo } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import ImageDetailView from '@/src/screens/image/components/ImageDetailView';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CarouselItemProps {
    image: ImageType;
    isActive: boolean;
    onLikePress: (imageId: string) => void;
    onBookmarkPress: () => void;
}

/**
 * CarouselItem - Simple fullscreen image slide (Pinterest style)
 * No fancy animations - just basic horizontal paging
 */
export const CarouselItem: React.FC<CarouselItemProps> = memo(({
    image,
    isActive,
    onLikePress,
    onBookmarkPress,
}) => {
    return (
        <Animated.View style={styles.container}>
            <ImageDetailView
                image={image}
                isActive={isActive}
                onLikePress={onLikePress}
                onBookmarkPress={onBookmarkPress}
            />
        </Animated.View>
    );
});

CarouselItem.displayName = 'CarouselItem';

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
        flex: 1,
    },
});

export default CarouselItem;
