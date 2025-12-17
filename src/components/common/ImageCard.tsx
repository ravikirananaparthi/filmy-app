import type { Image as ImageType } from '@/src/types/image.types';
import { Theme } from '@constants/theme';
import { Image } from 'expo-image';
import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { LikeButton } from './LikeButton';

interface ImageCardProps {
    image: ImageType;
    actressName?: string;
    isLiked: boolean;
    isLikePending?: boolean;
    onLike: (id: string) => void;
    onPress: (id: string) => void;
    columnWidth: number;
}

export const ImageCard: React.FC<ImageCardProps> = memo(({
    image,
    actressName,
    isLiked,
    isLikePending = false,
    onLike,
    onPress,
    columnWidth,
}) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    // Calculate height based on aspect ratio
    const imageHeight = columnWidth / (image.aspect_ratio || 0.75);

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
        <Pressable
            style={({ pressed }) => [
                styles.container,
                pressed && styles.pressed, // Minimal press effect
            ]}
            onPress={handlePress}
        >
            <View style={[styles.card, { backgroundColor: cardBackground }]}>
                {/* Image */}
                <View style={[styles.imageContainer, { height: imageHeight }]}>
                    <Image
                        source={{ uri: image.thumbnail_url }}
                        style={styles.image}
                        placeholder={{ blurhash: image.blurhash }}
                        contentFit="cover"
                        transition={200}
                        cachePolicy="disk"
                        recyclingKey={image.id}
                    />

                    {/* Like Button */}
                    <View style={styles.likeButtonContainer}>
                        <LikeButton
                            isLiked={isLiked}
                            onPress={handleLike}
                            disabled={isLikePending}
                            size={32}
                        />
                    </View>
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
        </Pressable>
    );
});

ImageCard.displayName = 'ImageCard';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 4,
    },
    pressed: {
        opacity: 0.9, // Minimal press feedback
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
        top: 6,
        right: 6,
        zIndex: 10,
    },
    infoContainer: {
        paddingHorizontal: 8,
        paddingVertical: 6,
    },
    actressName: {
        fontSize: 12,
        fontWeight: '500',
    },
});

export default ImageCard;
