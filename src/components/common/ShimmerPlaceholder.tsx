import { Theme } from '@constants/theme';
import React, { memo } from 'react';
import { Dimensions, StyleSheet, useColorScheme, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const NUM_COLUMNS = 2;
const COLUMN_WIDTH = SCREEN_WIDTH / NUM_COLUMNS;

// Shimmer colors for dark mode (dark gray shades)
const SHIMMER_COLORS_DARK = [
    '#1A1A1A',  // Dark gray background
    '#2A2A2A',  // Slightly lighter gray
    '#1A1A1A',  // Back to dark gray
];

// Shimmer colors for light mode (light gray shades)
const SHIMMER_COLORS_LIGHT = [
    '#E5E5E5',  // Light gray background
    '#F0F0F0',  // Slightly lighter
    '#E5E5E5',  // Back to light gray
];

// Hook to get shimmer colors based on color scheme
const useShimmerColors = () => {
    const colorScheme = useColorScheme();
    return colorScheme === 'dark' ? SHIMMER_COLORS_DARK : SHIMMER_COLORS_LIGHT;
};

// ============================================
// 1. IMAGE GRID SHIMMER
// ============================================

interface ShimmerImageCardProps {
    height?: number;
}

/**
 * Shimmer placeholder for a single image card
 */
export const ShimmerImageCard: React.FC<ShimmerImageCardProps> = memo(({
    height = 200,
}) => {
    const shimmerColors = useShimmerColors();

    return (
        <View style={styles.cardContainer}>
            <View style={styles.card}>
                <ShimmerPlaceholder
                    style={[styles.imagePlaceholder, { height }]}
                    shimmerColors={shimmerColors}
                    visible={false}
                />
            </View>
        </View>
    );
});

ShimmerImageCard.displayName = 'ShimmerImageCard';

interface ShimmerGridProps {
    count?: number;
}

/**
 * Masonry-style grid of shimmer placeholders
 * Two independent columns with varying heights to mimic real masonry layout
 */
export const ShimmerGrid: React.FC<ShimmerGridProps> = memo(({
    count = 6,
}) => {
    const shimmerColors = useShimmerColors();

    // Left column heights (taller items)
    const leftHeights = [280, 200, 260, 220];
    // Right column heights (different pattern for masonry effect)
    const rightHeights = [180, 260, 200, 280];

    const leftCount = Math.ceil(count / 2);
    const rightCount = Math.floor(count / 2);

    return (
        <View style={styles.masonryContainer}>
            {/* Left Column */}
            <View style={styles.masonryColumn}>
                {Array.from({ length: leftCount }).map((_, index) => (
                    <View key={`left-${index}`} style={styles.masonryCard}>
                        <ShimmerPlaceholder
                            style={[
                                styles.masonryPlaceholder,
                                { height: leftHeights[index % leftHeights.length] }
                            ]}
                            shimmerColors={shimmerColors}
                            visible={false}
                        />
                    </View>
                ))}
            </View>

            {/* Right Column */}
            <View style={styles.masonryColumn}>
                {Array.from({ length: rightCount }).map((_, index) => (
                    <View key={`right-${index}`} style={styles.masonryCard}>
                        <ShimmerPlaceholder
                            style={[
                                styles.masonryPlaceholder,
                                { height: rightHeights[index % rightHeights.length] }
                            ]}
                            shimmerColors={shimmerColors}
                            visible={false}
                        />
                    </View>
                ))}
            </View>
        </View>
    );
});

ShimmerGrid.displayName = 'ShimmerGrid';

// ============================================
// 2. PROFILE HERO SHIMMER
// ============================================

const HERO_HEIGHT = SCREEN_HEIGHT * 0.65;

/**
 * Shimmer placeholder for ProfileHero cover image
 */
export const ShimmerProfileHero: React.FC = memo(() => {
    const shimmerColors = useShimmerColors();

    return (
        <View style={styles.heroContainer}>
            <ShimmerPlaceholder
                style={styles.heroImage}
                shimmerColors={shimmerColors}
                visible={false}
            />
            {/* Name placeholder */}
            <View style={styles.heroContent}>
                <ShimmerPlaceholder
                    style={styles.heroNamePlaceholder}
                    shimmerColors={shimmerColors}
                    visible={false}
                />
                <ShimmerPlaceholder
                    style={styles.heroButtonPlaceholder}
                    shimmerColors={shimmerColors}
                    visible={false}
                />
            </View>
        </View>
    );
});

ShimmerProfileHero.displayName = 'ShimmerProfileHero';

// ============================================
// 3. HIGHLIGHTS CAROUSEL SHIMMER
// ============================================

const HIGHLIGHT_CARD_WIDTH = SCREEN_WIDTH * 0.7;
const HIGHLIGHT_CARD_HEIGHT = 220;

/**
 * Shimmer placeholder for HighlightsCarousel
 */
export const ShimmerHighlightsCarousel: React.FC = memo(() => {
    const shimmerColors = useShimmerColors();

    return (
        <View style={styles.carouselContainer}>
            {[0, 1].map((index) => (
                <View key={index} style={styles.highlightCardContainer}>
                    <ShimmerPlaceholder
                        style={styles.highlightCard}
                        shimmerColors={shimmerColors}
                        visible={false}
                    />
                    <View style={styles.highlightTextContainer}>
                        <ShimmerPlaceholder
                            style={styles.highlightTitle}
                            shimmerColors={shimmerColors}
                            visible={false}
                        />
                        <ShimmerPlaceholder
                            style={styles.highlightCaption}
                            shimmerColors={shimmerColors}
                            visible={false}
                        />
                    </View>
                </View>
            ))}
        </View>
    );
});

ShimmerHighlightsCarousel.displayName = 'ShimmerHighlightsCarousel';

// ============================================
// 4. FEATURED ACTRESSES ROW SHIMMER
// ============================================

const ACTRESS_CARD_SIZE = 100;

/**
 * Shimmer placeholder for FeaturedActressesRow
 */
export const ShimmerActressesRow: React.FC = memo(() => {
    const shimmerColors = useShimmerColors();

    return (
        <View style={styles.actressesContainer}>
            {[0, 1, 2, 3].map((index) => (
                <View key={index} style={styles.actressCardContainer}>
                    <ShimmerPlaceholder
                        style={styles.actressAvatar}
                        shimmerColors={shimmerColors}
                        visible={false}
                    />
                    <ShimmerPlaceholder
                        style={styles.actressName}
                        shimmerColors={shimmerColors}
                        visible={false}
                    />
                </View>
            ))}
        </View>
    );
});

ShimmerActressesRow.displayName = 'ShimmerActressesRow';

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
    // Image Grid (individual card)
    cardContainer: {
        width: COLUMN_WIDTH,
        padding: 4,
    },
    card: {
        borderRadius: Theme.radius.lg,
    },
    imagePlaceholder: {
        width: '100%',
        borderRadius: Theme.radius.lg,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: Theme.spacing.sm,
    },

    // Masonry Grid Layout
    masonryContainer: {
        flexDirection: 'row',
        paddingTop: Theme.spacing.sm,
    },
    masonryColumn: {
        flex: 1,
    },
    masonryCard: {
        padding: 4,
    },
    masonryPlaceholder: {
        width: '100%',
        borderRadius: Theme.radius.lg,
    },

    // Profile Hero
    heroContainer: {
        height: HERO_HEIGHT,
        width: SCREEN_WIDTH,
        backgroundColor: Theme.colors.background.dark,
    },
    heroImage: {
        ...StyleSheet.absoluteFillObject,
    },
    heroContent: {
        position: 'absolute',
        bottom: 80,
        left: Theme.spacing.lg,
        right: Theme.spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    heroNamePlaceholder: {
        width: 180,
        height: 32,
        borderRadius: Theme.radius.sm,
    },
    heroButtonPlaceholder: {
        width: 100,
        height: 36,
        borderRadius: Theme.radius.full,
    },

    // Highlights Carousel
    carouselContainer: {
        flexDirection: 'row',
        paddingHorizontal: Theme.spacing.md,
        gap: Theme.spacing.md,
        paddingVertical: Theme.spacing.sm,
    },
    highlightCardContainer: {
        width: HIGHLIGHT_CARD_WIDTH,
    },
    highlightCard: {
        width: '100%',
        height: HIGHLIGHT_CARD_HEIGHT,
        borderRadius: Theme.radius.lg,
    },
    highlightTextContainer: {
        marginTop: Theme.spacing.sm,
    },
    highlightTitle: {
        width: 120,
        height: 16,
        borderRadius: Theme.radius.sm,
        marginBottom: 4,
    },
    highlightCaption: {
        width: 80,
        height: 12,
        borderRadius: Theme.radius.sm,
    },

    // Actresses Row
    actressesContainer: {
        flexDirection: 'row',
        paddingHorizontal: Theme.spacing.md,
        gap: Theme.spacing.lg,
        paddingVertical: Theme.spacing.sm,
    },
    actressCardContainer: {
        alignItems: 'center',
    },
    actressAvatar: {
        width: ACTRESS_CARD_SIZE,
        height: ACTRESS_CARD_SIZE,
        borderRadius: ACTRESS_CARD_SIZE / 2,
    },
    actressName: {
        width: 70,
        height: 12,
        borderRadius: Theme.radius.sm,
        marginTop: Theme.spacing.sm,
    },
});

export default ShimmerGrid;
