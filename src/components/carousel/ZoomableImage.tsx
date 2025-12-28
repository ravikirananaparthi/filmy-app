import type { Image as ImageType } from '@/src/types/image.types';
import { Image } from 'expo-image';
import React, { memo, useCallback, useState } from 'react';
import { Dimensions, Pressable, StyleSheet } from 'react-native';
import {
    Gesture,
    GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedImage = Animated.createAnimatedComponent(Image);

// Zoom constraints
const MIN_SCALE = 1;
const MAX_SCALE = 5;
const DOUBLE_TAP_SCALE = 2;

const SPRING_CONFIG = {
    damping: 20,
    stiffness: 200,
    mass: 0.5,
};

interface ZoomableImageProps {
    image: ImageType;
    isActive: boolean;
}

const clamp = (value: number, min: number, max: number): number => {
    'worklet';
    return Math.min(max, Math.max(min, value));
};

const getMaxTranslateX = (currentScale: number): number => {
    'worklet';
    return Math.max(0, (SCREEN_WIDTH * currentScale - SCREEN_WIDTH) / 2);
};

const getMaxTranslateY = (currentScale: number): number => {
    'worklet';
    return Math.max(0, (SCREEN_HEIGHT * currentScale - SCREEN_HEIGHT) / 2);
};

/**
 * ZoomableImage - Simple implementation that doesn't block carousel swiping
 * 
 * Strategy: Only use gesture detection for pinch zoom.
 * Double tap handled via Pressable (doesn't block scroll)
 * Pan only when zoomed in.
 */
export const ZoomableImage: React.FC<ZoomableImageProps> = memo(({ image, isActive }) => {
    const [showOriginal, setShowOriginal] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);

    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const savedTranslateX = useSharedValue(0);
    const savedTranslateY = useSharedValue(0);
    const lastTap = useSharedValue(0);

    const loadOriginal = useCallback(() => {
        setShowOriginal(true);
    }, []);

    const updateZoomState = useCallback((zoomed: boolean) => {
        setIsZoomed(zoomed);
    }, []);

    // Handle double tap via standard React handler (doesn't block scroll)
    const handleDoubleTap = useCallback(() => {
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300;

        if (now - lastTap.value < DOUBLE_TAP_DELAY) {
            // Double tap detected
            if (scale.value > 1.01) {
                // Reset
                scale.value = withSpring(1, SPRING_CONFIG);
                translateX.value = withSpring(0, SPRING_CONFIG);
                translateY.value = withSpring(0, SPRING_CONFIG);
                savedScale.value = 1;
                savedTranslateX.value = 0;
                savedTranslateY.value = 0;
                setIsZoomed(false);
            } else {
                // Zoom in
                scale.value = withSpring(DOUBLE_TAP_SCALE, SPRING_CONFIG);
                savedScale.value = DOUBLE_TAP_SCALE;
                setIsZoomed(true);
                loadOriginal();
            }
        }
        lastTap.value = now;
    }, [scale, translateX, translateY, savedScale, savedTranslateX, savedTranslateY, lastTap, loadOriginal]);

    // Pinch gesture - always active
    const pinchGesture = Gesture.Pinch()
        .onUpdate((e) => {
            'worklet';
            scale.value = clamp(savedScale.value * e.scale, 0.5, MAX_SCALE);
        })
        .onEnd(() => {
            'worklet';
            if (scale.value < MIN_SCALE) {
                scale.value = withSpring(MIN_SCALE, SPRING_CONFIG);
                translateX.value = withSpring(0, SPRING_CONFIG);
                translateY.value = withSpring(0, SPRING_CONFIG);
                savedScale.value = MIN_SCALE;
                runOnJS(updateZoomState)(false);
            } else if (scale.value > MAX_SCALE) {
                scale.value = withSpring(MAX_SCALE, SPRING_CONFIG);
                savedScale.value = MAX_SCALE;
                runOnJS(updateZoomState)(true);
            } else {
                savedScale.value = scale.value;
                runOnJS(updateZoomState)(scale.value > 1.01);
            }
            if (scale.value > 1.5) {
                runOnJS(loadOriginal)();
            }
        });

    // Pan gesture - only when zoomed
    const panGesture = Gesture.Pan()
        .enabled(isZoomed)
        .minPointers(1)
        .maxPointers(1)
        .onStart(() => {
            'worklet';
            savedTranslateX.value = translateX.value;
            savedTranslateY.value = translateY.value;
        })
        .onUpdate((e) => {
            'worklet';
            if (scale.value > 1.01) {
                const maxX = getMaxTranslateX(scale.value);
                const maxY = getMaxTranslateY(scale.value);
                translateX.value = clamp(savedTranslateX.value + e.translationX, -maxX, maxX);
                translateY.value = clamp(savedTranslateY.value + e.translationY, -maxY, maxY);
            }
        })
        .onEnd(() => {
            'worklet';
            const maxX = getMaxTranslateX(scale.value);
            const maxY = getMaxTranslateY(scale.value);
            translateX.value = withSpring(clamp(translateX.value, -maxX, maxX), SPRING_CONFIG);
            translateY.value = withSpring(clamp(translateY.value, -maxY, maxY), SPRING_CONFIG);
        });

    const composedGesture = isZoomed
        ? Gesture.Simultaneous(pinchGesture, panGesture)
        : pinchGesture;

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
    }));

    // Reset when becoming inactive
    React.useEffect(() => {
        if (!isActive && scale.value !== 1) {
            scale.value = withTiming(1, { duration: 150 });
            translateX.value = withTiming(0, { duration: 150 });
            translateY.value = withTiming(0, { duration: 150 });
            savedScale.value = 1;
            savedTranslateX.value = 0;
            savedTranslateY.value = 0;
            setIsZoomed(false);
        }
    }, [isActive]);

    const imageUrl = showOriginal ? image.image_url : image.thumbnail_url;

    return (
        <GestureDetector gesture={composedGesture}>
            <Pressable onPress={handleDoubleTap} style={styles.container}>
                <Animated.View style={[styles.imageWrapper, animatedStyle]}>
                    <AnimatedImage
                        source={{ uri: imageUrl }}
                        placeholder={{ blurhash: image.blurhash }}
                        style={styles.image}
                        contentFit="contain"
                        transition={200}
                        cachePolicy="disk"
                        recyclingKey={image.id}
                    />
                </Animated.View>
            </Pressable>
        </GestureDetector>
    );
});

ZoomableImage.displayName = 'ZoomableImage';

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageWrapper: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

export default ZoomableImage;
