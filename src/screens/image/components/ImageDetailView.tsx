import { BookmarkIcon } from '@/components/icons/ui-icons/bookmark-icon';
import { Text } from '@/src/components/ui';
import type { Image as ImageType } from '@/src/types/image.types';
import { Image } from 'expo-image';
import { Share2 } from 'lucide-react-native';
import React, { memo, useCallback, useMemo } from 'react';
import { InteractionManager } from 'react-native';
import { Dimensions, Pressable, ScrollView, Share, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LikeButton } from '@/src/components/common/LikeButton';
import RelatedImagesMasonry from './RelatedImagesMasonry';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedImage = Animated.createAnimatedComponent(Image);
const IMAGE_RADIUS = 24;

interface ImageDetailViewProps {
    image: ImageType;
    isActive: boolean;
    onLikePress: (imageId: string) => void;
    onBookmarkPress: () => void;
}

const formatDate = (value?: string) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

export const ImageDetailView: React.FC<ImageDetailViewProps> = memo(({
    image,
    isActive,
    onLikePress,
    onBookmarkPress,
}) => {
    const insets = useSafeAreaInsets();
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const [shouldLoadRelated, setShouldLoadRelated] = React.useState(false);

    const imageHeight = useMemo(() => {
        const ratio = image.aspect_ratio || (image.width && image.height ? image.width / image.height : 0.75);
        return SCREEN_WIDTH / ratio;
    }, [image.aspect_ratio, image.width, image.height]);

    const uploaderName = image.uploader?.display_name || image.actress?.name || 'Filmy creator';
    const uploaderAvatar = image.uploader?.avatar_url || image.actress?.cover_image_url;
    const dateLabel = formatDate(image.created_at);
    const tags = image.tags ?? [];

    const pinchGesture = Gesture.Pinch()
        .onUpdate((event) => {
            'worklet';
            scale.value = Math.min(4, Math.max(1, savedScale.value * event.scale));
        })
        .onEnd(() => {
            'worklet';
            if (scale.value < 1.05) {
                scale.value = withSpring(1);
                savedScale.value = 1;
            } else {
                savedScale.value = scale.value;
            }
        });

    const animatedImageStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    React.useEffect(() => {
        if (!isActive) {
            scale.value = withSpring(1);
            savedScale.value = 1;
        }
    }, [isActive, scale, savedScale]);

    React.useEffect(() => {
        if (!isActive) {
            setShouldLoadRelated(false);
            return;
        }

        const handle = InteractionManager.runAfterInteractions(() => {
            setShouldLoadRelated(true);
        });

        return () => handle.cancel();
    }, [image.id, isActive]);

    const handleShare = useCallback(() => {
        Share.share({
            message: image.image_url,
            url: image.image_url,
        });
    }, [image.image_url]);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 28 }]}
            showsVerticalScrollIndicator={false}
            bounces
        >
            <View style={[styles.imageShell, { height: imageHeight, marginTop: insets.top }]}>
                <GestureDetector gesture={pinchGesture}>
                    <Animated.View style={[styles.imageWrapper, animatedImageStyle]}>
                        <AnimatedImage
                            source={{ uri: image.image_url || image.thumbnail_url }}
                            placeholder={{ blurhash: image.blurhash }}
                            style={styles.image}
                            contentFit="cover"
                            transition={180}
                            cachePolicy="memory-disk"
                            recyclingKey={image.id}
                        />
                    </Animated.View>
                </GestureDetector>
            </View>

            <View style={styles.actionsRow}>
                <LikeButton
                    imageId={image.id}
                    onLikePress={onLikePress}
                    size={44}
                />
                <Pressable style={styles.actionButton} onPress={onBookmarkPress} hitSlop={10}>
                    <BookmarkIcon size={22} color="#111" />
                </Pressable>
                <Pressable style={styles.actionButton} onPress={handleShare} hitSlop={10}>
                    <Share2 size={22} color="#111" strokeWidth={2.4} />
                </Pressable>
            </View>

            {tags.length > 0 && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tagsContent}
                >
                    {tags.map((tag) => (
                        <View key={tag} style={styles.tagChip}>
                            <Text weight="medium" style={styles.tagText}>#{tag}</Text>
                        </View>
                    ))}
                </ScrollView>
            )}

            <View style={styles.uploaderRow}>
                <View style={styles.avatar}>
                    {uploaderAvatar ? (
                        <Image source={{ uri: uploaderAvatar }} style={styles.avatarImage} contentFit="cover" />
                    ) : (
                        <Text weight="bold" style={styles.avatarInitial}>
                            {uploaderName.charAt(0).toUpperCase()}
                        </Text>
                    )}
                </View>
                <View style={styles.uploaderText}>
                    <Text weight="semibold" style={styles.uploaderName} numberOfLines={1}>
                        {uploaderName}
                    </Text>
                    {!!dateLabel && (
                        <Text style={styles.dateText}>{dateLabel}</Text>
                    )}
                </View>
            </View>

            <Text weight="bold" style={styles.heading}>More like this</Text>
            <RelatedImagesMasonry imageId={image.id} enabled={shouldLoadRelated} />
        </ScrollView>
    );
});

ImageDetailView.displayName = 'ImageDetailView';

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
        flex: 1,
        backgroundColor: '#0B0B0F',
    },
    content: {
        backgroundColor: '#0B0B0F',
    },
    imageShell: {
        width: SCREEN_WIDTH,
        backgroundColor: '#050507',
        borderRadius: IMAGE_RADIUS,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    imageWrapper: {
        width: SCREEN_WIDTH,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: IMAGE_RADIUS,
    },
    actionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    actionButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F4F4F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tagsContent: {
        gap: 8,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    tagChip: {
        borderRadius: 18,
        backgroundColor: 'rgba(139, 92, 246, 0.18)',
        borderWidth: 1,
        borderColor: 'rgba(167, 139, 250, 0.32)',
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    tagText: {
        color: '#DDD6FE',
        fontSize: 13,
    },
    uploaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 18,
        paddingBottom: 22,
        gap: 12,
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#27272A',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    avatarInitial: {
        color: '#fff',
        fontSize: 16,
    },
    uploaderText: {
        flex: 1,
    },
    uploaderName: {
        color: '#fff',
        fontSize: 16,
    },
    dateText: {
        color: 'rgba(255,255,255,0.54)',
        fontSize: 12,
        marginTop: 2,
    },
    heading: {
        color: '#fff',
        fontSize: 20,
        paddingHorizontal: 16,
        paddingBottom: 10,
    },
});

export default ImageDetailView;
