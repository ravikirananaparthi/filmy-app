import React, { memo } from 'react';
import { Dimensions, StyleSheet, useColorScheme, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.9;

// Shimmer colors for dark/light mode
const SHIMMER_COLORS_DARK = ['#1A1A1A', '#2A2A2A', '#1A1A1A'];
const SHIMMER_COLORS_LIGHT = ['#E5E5E5', '#F0F0F0', '#E5E5E5'];

const useShimmerColors = () => {
    const colorScheme = useColorScheme();
    return colorScheme === 'dark' ? SHIMMER_COLORS_DARK : SHIMMER_COLORS_LIGHT;
};

/**
 * Shimmer placeholder for a single preview card (Liked/Saved/Following)
 */
const ShimmerPreviewCard: React.FC<{ accentColor: string }> = memo(({ accentColor }) => {
    const shimmerColors = useShimmerColors();

    return (
        <View style={styles.container}>
            {/* Card with accent background */}
            <View style={[styles.card, { backgroundColor: accentColor, opacity: 0.3 }]}>
                {/* Images placeholder */}
                <View style={styles.imageWrapper}>
                    {[0, 1, 2, 3].map((index) => (
                        <View
                            key={index}
                            style={[
                                styles.imageSlot,
                                index === 0 && styles.firstImage,
                                index === 1 && styles.secondImage,
                                index === 2 && styles.thirdImage,
                                index === 3 && styles.lastImage,
                                index !== 0 && { marginLeft: -12 },
                            ]}
                        >
                            <ShimmerPlaceholder
                                style={styles.imagePlaceholder}
                                shimmerColors={shimmerColors}
                                visible={false}
                            />
                        </View>
                    ))}
                </View>
            </View>

            {/* Info placeholder */}
            <View style={styles.infoContainer}>
                <ShimmerPlaceholder
                    style={styles.titlePlaceholder}
                    shimmerColors={shimmerColors}
                    visible={false}
                />
                <ShimmerPlaceholder
                    style={styles.countPlaceholder}
                    shimmerColors={shimmerColors}
                    visible={false}
                />
            </View>
        </View>
    );
});

ShimmerPreviewCard.displayName = 'ShimmerPreviewCard';

/**
 * Full shimmer layout for Favorites screen loading state
 * Shows 3 shimmer cards for Liked, Saved, Following
 */
export const ShimmerFavoritesPreview: React.FC = memo(() => {
    return (
        <View style={styles.previewContainer}>
            <ShimmerPreviewCard accentColor="#FF6B8A" />
            <ShimmerPreviewCard accentColor="#8B9DFF" />
            <ShimmerPreviewCard accentColor="#4ECDC4" />
        </View>
    );
});

ShimmerFavoritesPreview.displayName = 'ShimmerFavoritesPreview';

const styles = StyleSheet.create({
    previewContainer: {
        flex: 1,
        paddingTop: 16,
    },
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
    },
    imageWrapper: {
        flexDirection: 'row',
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageSlot: {
        flex: 1,
        height: '100%',
        borderWidth: 3,
        borderColor: '#FFFFFF',
        backgroundColor: '#eee',
        overflow: 'hidden',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
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
    lastImage: {
        borderTopRightRadius: 40,
        borderBottomRightRadius: 40,
        borderTopLeftRadius: 50,
        borderBottomLeftRadius: 15,
    },
    infoContainer: {
        alignItems: 'center',
        marginTop: 12,
    },
    titlePlaceholder: {
        width: 80,
        height: 20,
        borderRadius: 6,
        marginBottom: 6,
    },
    countPlaceholder: {
        width: 60,
        height: 14,
        borderRadius: 4,
    },
});

export default ShimmerFavoritesPreview;
