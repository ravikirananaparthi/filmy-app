import { FlashList } from '@shopify/flash-list';
import React from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    ViewStyle
} from 'react-native';
import HighlightCard from './HighlightCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.7; // Larger card for Apple Movies style
const CARD_SPACING = 12;
const SIDE_PADDING = (SCREEN_WIDTH - CARD_WIDTH) / 2; // Centers the active card
const ITEM_WIDTH = CARD_WIDTH + CARD_SPACING;
const CARD_HEIGHT = 420; // Match HighlightCard height

export interface HighlightItem {
    id: string;
    imageUrl: string;
    name: string;
    caption?: string;
}

interface HighlightsCarouselProps {
    data: HighlightItem[];
    onItemPress?: (item: HighlightItem) => void;
    style?: ViewStyle;
}

/**
 * Apple Movies style carousel.
 * Center card prominent, side cards peek from edges.
 * Starts at middle item, swipable both ways.
 */
export default function HighlightsCarousel({
    data,
    onItemPress,
    style,
}: HighlightsCarouselProps) {
    // Calculate initial index to center the middle item
    const initialIndex = Math.floor(data.length / 2);

    const renderItem = ({ item }: { item: HighlightItem }) => (
        <View style={styles.cardWrapper}>
            <HighlightCard
                imageUrl={item.imageUrl}
                name={item.name}
                caption={item.caption}
                onPress={() => onItemPress?.(item)}
            />
        </View>
    );

    return (
        <View style={[styles.container, style]}>
            <FlashList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
                estimatedItemSize={ITEM_WIDTH}
                snapToInterval={ITEM_WIDTH}
                snapToAlignment="start"
                decelerationRate="fast"
                initialScrollIndex={initialIndex}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: CARD_HEIGHT + 16, // Card height + padding
    },
    contentContainer: {
        paddingHorizontal: SIDE_PADDING,
        paddingBottom: 8,
    },
    cardWrapper: {
        width: CARD_WIDTH,
        marginRight: CARD_SPACING,
    },
});

