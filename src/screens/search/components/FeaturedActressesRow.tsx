import { FlashList } from '@shopify/flash-list';
import React from 'react';
import {
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';
import ActressMiniCard from './ActressMiniCard';

const CARD_WIDTH = 140;
const CARD_HEIGHT = 200;
const CARD_SPACING = 12;
const ITEM_WIDTH = CARD_WIDTH + CARD_SPACING;

export interface ActressItem {
    id: string;
    imageUrl: string;
    name: string;
}

interface FeaturedActressesRowProps {
    data: ActressItem[];
    onItemPress?: (item: ActressItem) => void;
    style?: ViewStyle;
}

/**
 * Horizontal row of actress mini cards.
 * Smooth scroll with no bounce jitter.
 */
export default function FeaturedActressesRow({
    data,
    onItemPress,
    style,
}: FeaturedActressesRowProps) {
    const renderItem = ({ item }: { item: ActressItem }) => (
        <View style={styles.cardWrapper}>
            <ActressMiniCard
                imageUrl={item.imageUrl}
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
                bounces={false}
                overScrollMode="never"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: CARD_HEIGHT + 16, // Card height + padding
    },
    contentContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    cardWrapper: {
        marginRight: CARD_SPACING,
    },
});

