import { Text } from '@/src/components/ui';
import type { Image as ImageType } from '@/src/types/image.types';
import { Theme } from '@constants/theme';
import { Image } from 'expo-image';
import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View, useColorScheme } from 'react-native';
import { LikeButton } from './LikeButton';

interface ImageCardProps {
    image: ImageType;
    actressName?: string;
    onLike: (imageId: string) => void;
    onPress: (imageId: string) => void;
    columnWidth: number;
    hideLikeButton?: boolean;
    hideActressName?: boolean;
}

// Custom comparison function to prevent unnecessary re-renders
// Only re-render if image data or visual props actually changed
const areEqual = (prevProps: ImageCardProps, nextProps: ImageCardProps): boolean => {
    return (
        prevProps.image.id === nextProps.image.id &&
        prevProps.image.thumbnail_url === nextProps.image.thumbnail_url &&
        prevProps.image.aspect_ratio === nextProps.image.aspect_ratio &&
        prevProps.image.blurhash === nextProps.image.blurhash &&
        prevProps.actressName === nextProps.actressName &&
        prevProps.columnWidth === nextProps.columnWidth &&
        prevProps.hideLikeButton === nextProps.hideLikeButton &&
        prevProps.hideActressName === nextProps.hideActressName
    );
};

/**
 * Image card component for the feed
 * Simple navigation - just pushes to image detail screen
 * Uses custom memo comparison to prevent re-renders on callback changes
 */
export const ImageCard: React.FC<ImageCardProps> = memo(({
    image,
    actressName,
    onLike,
    onPress,
    columnWidth,
    hideLikeButton = false,
    hideActressName = false,
}) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    // Calculate height based on aspect ratio
    const imageHeight = columnWidth / (image.aspect_ratio || 0.75);

    const handlePress = useCallback(() => {
        // Use onPress callback from parent to preserve context (e.g., actressId)
        onPress(image.id);
    }, [image.id, onPress]);

    const cardBackground = isDark
        ? Theme.colors.background.surface.dark
        : Theme.colors.background.surface.light;

    const textColor = isDark
        ? Theme.colors.text.primary
        : Theme.colors.textLight.primary;

    return (
        <View style={styles.container}>
            <View style={[styles.card, { backgroundColor: cardBackground }]}>
                <Pressable onPress={handlePress}>
                    <View style={[styles.imageContainer, { height: imageHeight }]}>
                        <Image
                            source={{ uri: image.thumbnail_url }}
                            style={styles.image}
                            placeholder={{ blurhash: image.blurhash }}
                            contentFit="cover"
                            recyclingKey={image.id}
                            placeholderContentFit="cover"
                            transition={0}
                            cachePolicy="memory-disk"
                        />
                    </View>
                </Pressable>

                {/* Like Button */}
                {!hideLikeButton && (
                    <View style={styles.likeButtonContainer}>
                        <LikeButton
                            imageId={image.id}
                            onLikePress={onLike}
                            size={32}
                        />
                    </View>
                )}

                {/* Actress Name */}
                {actressName && !hideActressName && (
                    <View style={styles.infoContainer}>
                        <Text style={[styles.actressName, { color: textColor }]} numberOfLines={1}>
                            {actressName}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
}, areEqual);

ImageCard.displayName = 'ImageCard';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 4,
    },
    card: {
        borderRadius: Theme.radius.lg,
        overflow: 'hidden',
        ...Theme.shadows.sm,
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
        top: 10,
        right: 10,
        zIndex: 10,
    },
    infoContainer: {
        paddingHorizontal: 8,
        paddingVertical: 6,
    },
    actressName: {
        fontSize: 12,
    },
});

export default ImageCard;
