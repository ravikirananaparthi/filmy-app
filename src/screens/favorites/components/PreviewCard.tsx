import { FontFamily } from '@/constants/theme';
import { Text } from '@/src/components/ui';
import type { PreviewImage } from '@/src/types/favorites.types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import {
    Dimensions,
    Pressable,
    StyleSheet,
    View,
    useColorScheme,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.9;
const CARD_PADDING = 24; // 12 * 2
const MAX_IMAGE_WIDTH = (CARD_WIDTH - CARD_PADDING - 36) / 4; // Width for 4 images

interface PreviewCardProps {
    title: string;
    count: number;
    images: PreviewImage[];
    accentColor: string;
    iconName: 'heart' | 'bookmark';
    onPress: () => void;
}

/**
 * Preview card component for Favorites home screen
 * Images have max width so 1-2 images don't stretch too wide
 */
export function PreviewCard({
    title,
    count,
    images,
    accentColor,
    iconName,
    onPress,
}: PreviewCardProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const textColor = isDark ? '#FFFFFF' : '#000000';
    const secondaryTextColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';

    // Take up to 4 images
    const displayImages = images.slice(0, 4);

    const getImageStyle = (index: number, total: number) => {
        if (total === 1) {
            return styles.singleImage;
        }
        if (index === 0) {
            return styles.firstImage;
        }
        if (index === total - 1) {
            return styles.lastImage;
        }
        if (total === 3 && index === 1) {
            return styles.middleImageCenter;
        }
        if (total === 4) {
            return index === 1 ? styles.secondImage : styles.thirdImage;
        }
        return styles.middleImageCenter;
    };

    // Calculate width based on number of images
    // 1 image: slightly larger than base, 2-3: progressively wider
    const getImageWidth = (total: number) => {
        if (total >= 4) return undefined; // flex: 1 for 4 images
        if (total === 1) return { width: MAX_IMAGE_WIDTH * 1.3, flex: undefined };
        if (total === 2) return { width: MAX_IMAGE_WIDTH * 1.4, flex: undefined };
        if (total === 3) return { width: MAX_IMAGE_WIDTH * 1.2, flex: undefined };
        return undefined;
    };

    return (
        <Pressable style={styles.container} onPress={onPress}>
            {/* Card with accent background */}
            <View style={[styles.card, { backgroundColor: accentColor }]}>
                {/* Fancy Icon Badge */}
                <View style={styles.iconBadge}>
                    <View style={[styles.iconCircle, { backgroundColor: accentColor }]}>
                        <Ionicons name={iconName} size={18} color="#FFFFFF" />
                    </View>
                </View>

                {/* Images Section */}
                <View style={styles.imageWrapper}>
                    {displayImages.length > 0 ? (
                        displayImages.map((image, index) => (
                            <View
                                key={`${image.id}-${index}`}
                                style={[
                                    styles.imageContainer,
                                    getImageStyle(index, displayImages.length),
                                    getImageWidth(displayImages.length),
                                    index !== 0 && { marginLeft: -12 },
                                ]}
                            >
                                <Image
                                    source={{ uri: image.thumbnailUrl }}
                                    style={styles.image}
                                    contentFit="cover"
                                    placeholder={image.blurHash ? { blurhash: image.blurHash } : undefined}
                                />
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name={`${iconName}-outline`} size={32} color="rgba(255,255,255,0.5)" />
                        </View>
                    )}
                </View>
            </View>

            {/* Info below card */}
            <View style={styles.infoContainer}>
                <Text style={[styles.title, { color: textColor }]}>{title}</Text>
                <Text style={[styles.count, { color: secondaryTextColor }]}>
                    {count} {count === 1 ? 'Image' : 'Images'}
                </Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 20,
    },
    card: {
        padding: 12,
        borderRadius: 35,
        width: CARD_WIDTH,
        alignSelf: 'center',
        position: 'relative',
    },
    iconBadge: {
        position: 'absolute',
        top: -8,
        right: 16,
        zIndex: 10,
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    imageWrapper: {
        flexDirection: 'row',
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageContainer: {
        flex: 1,
        height: '100%',
        borderWidth: 3,
        borderColor: '#FFFFFF',
        backgroundColor: '#eee',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    singleImage: {
        borderRadius: 30,
    },
    firstImage: {
        borderTopLeftRadius: 40,
        borderBottomLeftRadius: 40,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 50,
    },
    secondImage: {
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 45,
        borderTopRightRadius: 35,
        borderBottomRightRadius: 20,
        transform: [{ scale: 1.03 }],
        zIndex: 1,
    },
    thirdImage: {
        borderTopLeftRadius: 35,
        borderBottomLeftRadius: 20,
        borderTopRightRadius: 25,
        borderBottomRightRadius: 45,
        transform: [{ scale: 1.03 }],
        zIndex: 1,
    },
    middleImageCenter: {
        borderRadius: 30,
        transform: [{ scale: 1.03 }],
        zIndex: 1,
    },
    lastImage: {
        borderTopRightRadius: 40,
        borderBottomRightRadius: 40,
        borderTopLeftRadius: 50,
        borderBottomLeftRadius: 15,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        alignItems: 'center',
        marginTop: 12,
    },
    title: {
        fontSize: 18,
        fontFamily: FontFamily.semibold,
        marginBottom: 4,
    },
    count: {
        fontSize: 14,
        fontFamily: FontFamily.regular,
    },
});
