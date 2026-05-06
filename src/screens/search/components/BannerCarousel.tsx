import { FontFamily } from '@/constants/theme';
import { Text } from '@/src/components/ui';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Pressable,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const BANNER_HEIGHT = 300;
const AUTO_ADVANCE_MS = 3800;
const DOT_SIZE = 6;
const DOT_ACTIVE_WIDTH = 22;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BannerItem {
    id: string;
    imageUrl: string;
    title: string;
    subtitle?: string;
}

interface BannerCarouselProps {
    data: BannerItem[];
    onItemPress?: (item: BannerItem) => void;
    style?: ViewStyle;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Full-width, auto-advancing hero banner carousel.
 *
 * - Paging FlatList — each slide fills the screen width
 * - Auto-advances every 3.8s, pauses while the user is dragging
 * - Animated pill-dot pagination indicator at the bottom
 * - Gradient overlay with title + optional subtitle (e.g. "1.2k likes")
 */
export default function BannerCarousel({ data, onItemPress, style }: BannerCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList<BannerItem>>(null);
    const currentIndexRef = useRef(0);
    const isUserScrollingRef = useRef(false);

    // ── Auto-advance ────────────────────────────────────────────────────────
    useEffect(() => {
        if (data.length <= 1) return;
        const timer = setInterval(() => {
            if (isUserScrollingRef.current) return;
            const next = (currentIndexRef.current + 1) % data.length;
            try {
                flatListRef.current?.scrollToIndex({ index: next, animated: true });
            } catch {
                // scroll can fail if list is unmounted
            }
            currentIndexRef.current = next;
            setActiveIndex(next);
        }, AUTO_ADVANCE_MS);
        return () => clearInterval(timer);
    }, [data.length]);

    // ── Viewability ─────────────────────────────────────────────────────────
    const onViewableItemsChanged = useCallback(
        ({ viewableItems }: { viewableItems: any[] }) => {
            if (viewableItems.length > 0) {
                const newIdx = viewableItems[0].index ?? 0;
                currentIndexRef.current = newIdx;
                setActiveIndex(newIdx);
            }
        },
        [],
    );
    const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 });

    // ── Layout ──────────────────────────────────────────────────────────────
    const getItemLayout = useCallback(
        (_: unknown, index: number) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
        }),
        [],
    );

    // ── Render item ─────────────────────────────────────────────────────────
    const renderItem = useCallback(
        ({ item }: { item: BannerItem }) => (
            <Pressable
                style={styles.slide}
                onPress={() => onItemPress?.(item)}
            >
                <Image
                    source={{ uri: item.imageUrl }}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                    priority="high"
                    recyclingKey={item.id}
                    transition={250}
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.38)', 'rgba(0,0,0,0.88)']}
                    locations={[0.3, 0.62, 1]}
                    style={StyleSheet.absoluteFill}
                />
                <View style={styles.textContainer}>
                    {item.subtitle ? (
                        <Text style={styles.subtitle} numberOfLines={1}>
                            {item.subtitle}
                        </Text>
                    ) : null}
                    <Text style={styles.title} numberOfLines={2}>
                        {item.title}
                    </Text>
                </View>
            </Pressable>
        ),
        [onItemPress],
    );

    if (!data.length) return null;

    return (
        <View style={[styles.container, style]}>
            <FlatList
                ref={flatListRef}
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig.current}
                onScrollBeginDrag={() => {
                    isUserScrollingRef.current = true;
                }}
                onMomentumScrollEnd={() => {
                    isUserScrollingRef.current = false;
                }}
                getItemLayout={getItemLayout}
                bounces={false}
                decelerationRate="fast"
                removeClippedSubviews
            />

            {/* ── Pagination dots ─────────────────────────────────────── */}
            {data.length > 1 && (
                <View style={styles.dotsRow} pointerEvents="none">
                    {data.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.dot,
                                i === activeIndex ? styles.dotActive : styles.dotInactive,
                            ]}
                        />
                    ))}
                </View>
            )}
        </View>
    );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        height: BANNER_HEIGHT,
        width: SCREEN_WIDTH,
        backgroundColor: '#111',
    },
    slide: {
        width: SCREEN_WIDTH,
        height: BANNER_HEIGHT,
        backgroundColor: '#111',
    },
    textContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 18,
        paddingBottom: 32,
        paddingTop: 16,
        gap: 3,
    },
    subtitle: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.72)',
        fontFamily: FontFamily.medium,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    title: {
        fontSize: 23,
        color: '#FFFFFF',
        fontFamily: FontFamily.bold,
        letterSpacing: -0.3,
        lineHeight: 29,
    },
    // ── Dots ──────────────────────────────────────────────────────────────
    dotsRow: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },
    dot: {
        height: DOT_SIZE,
        borderRadius: DOT_SIZE / 2,
    },
    dotActive: {
        width: DOT_ACTIVE_WIDTH,
        backgroundColor: 'rgba(255,255,255,0.95)',
    },
    dotInactive: {
        width: DOT_SIZE,
        backgroundColor: 'rgba(255,255,255,0.38)',
    },
});
