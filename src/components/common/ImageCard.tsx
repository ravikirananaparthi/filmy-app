import type { Image as ImageType } from '@/src/types/image.types';
import { Theme } from '@constants/theme';
import { Image } from 'expo-image';
import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { LikeButton } from './LikeButton';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ImageCardProps {
    image: ImageType;
    actressName?: string;
    isLiked: boolean;
    onLike: (id: string) => void;
    onPress: (id: string) => void;
    columnWidth: number;
}

export const ImageCard: React.FC<ImageCardProps> = memo(({
    image,
    actressName,
    isLiked,
    onLike,
    onPress,
    columnWidth,
}) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    // Calculate height based on aspect ratio
    const imageHeight = columnWidth / (image.aspect_ratio || 0.75);

    // Press animation
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = useCallback(() => {
        scale.value = withSpring(0.97, {
            damping: 15,
            stiffness: 300,
        });
    }, [scale]);

    const handlePressOut = useCallback(() => {
        scale.value = withSpring(1, {
            damping: 12,
            stiffness: 200,
        });
    }, [scale]);

    const handlePress = useCallback(() => {
        onPress(image.id);
    }, [image.id, onPress]);

    const handleLike = useCallback(() => {
        onLike(image.id);
    }, [image.id, onLike]);

    const cardBackground = isDark
        ? Theme.colors.background.surface.dark
        : Theme.colors.background.surface.light;

    const textColor = isDark
        ? Theme.colors.text.primary
        : Theme.colors.textLight.primary;

    return (
        <AnimatedPressable
            style={[styles.container, animatedStyle]}
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <View style={[styles.card, { backgroundColor: cardBackground }]}>
                {/* Image */}
                <View style={[styles.imageContainer, { height: imageHeight }]}>
                    <Image
                        source={{ uri: image.thumbnail_url }}
                        style={styles.image}
                        placeholder={{ blurhash: image.blurhash }}
                        contentFit="cover"
                        transition={300}
                        cachePolicy="disk"
                        priority="high"
                    />

                    {/* Like Button */}
                    <View style={styles.likeButtonContainer}>
                        <LikeButton isLiked={isLiked} onPress={handleLike} size={36} />
                    </View>

                    {/* Gradient overlay for better text readability */}
                    <View style={styles.gradientOverlay} />
                </View>

                {/* Actress Name */}
                {actressName && (
                    <View style={styles.infoContainer}>
                        <Text style={[styles.actressName, { color: textColor }]} numberOfLines={1}>
                            {actressName}
                        </Text>
                    </View>
                )}
            </View>
        </AnimatedPressable>
    );
});

ImageCard.displayName = 'ImageCard';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 6,
    },
    card: {
        borderRadius: Theme.radius.lg,
        overflow: 'hidden',
        ...Theme.shadows.md,
    },
    imageContainer: {
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: Theme.radius.lg,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    likeButtonContainer: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 10,
    },
    gradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 40,
        background: 'linear-gradient(transparent, rgba(0,0,0,0.3))',
    },
    infoContainer: {
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    actressName: {
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 0.2,
    },
});

export default ImageCard;
