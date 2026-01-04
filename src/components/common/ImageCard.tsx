import { Text } from '@/src/components/ui';
import type { Image as ImageType } from '@/src/types/image.types';
import { Theme } from '@constants/theme';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View, useColorScheme } from 'react-native';
import { LikeButton } from './LikeButton';

interface ImageCardProps {
    image: ImageType;
    actressName?: string;
    onLike: (imageId: string) => void;
    onPress: (imageId: string) => void;
    columnWidth: number;
}

/**
 * Image card component for the feed
 * Simple navigation - just pushes to image detail screen
 */
export const ImageCard: React.FC<ImageCardProps> = memo(({
    image,
    actressName,
    onLike,
    onPress,
    columnWidth,
}) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    // Calculate height based on aspect ratio
    const imageHeight = columnWidth / (image.aspect_ratio || 0.75);

    const handlePress = useCallback(() => {
        router.push(`/image/${image.id}`);
    }, [image.id]);

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
                            // old props
                            // transition={200}
                            // cachePolicy="disk"
                            // new props
                            placeholderContentFit="cover"
                            transition={0}
                            cachePolicy="memory-disk"
                        />
                    </View>
                </Pressable>

                {/* Like Button */}
                <View style={styles.likeButtonContainer}>
                    <LikeButton
                        imageId={image.id}
                        onLikePress={onLike}
                        size={32}
                    />
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
        </View>
    );
});

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
