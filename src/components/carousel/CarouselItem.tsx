import type { Image as ImageType } from '@/src/types/image.types';
import React, { memo } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { ZoomableImage } from './ZoomableImage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CarouselItemProps {
    image: ImageType;
    isActive: boolean;
}

/**
 * CarouselItem - Simple fullscreen image slide (Pinterest style)
 * No fancy animations - just basic horizontal paging
 */
export const CarouselItem: React.FC<CarouselItemProps> = memo(({
    image,
    isActive,
}) => {
    return (
        <Animated.View style={styles.container}>
            <ZoomableImage image={image} isActive={isActive} />
        </Animated.View>
    );
});

CarouselItem.displayName = 'CarouselItem';

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CarouselItem;
