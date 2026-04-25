import type { Image } from '@/src/types/image.types';
import { Image as ExpoImage } from 'expo-image';
import { router } from 'expo-router';
import React, { memo } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PADDING = 16;
const GAP = 6;
const COLS = 3;
const CELL = (SCREEN_WIDTH - PADDING * 2 - GAP * (COLS - 1)) / COLS;

interface TrendingPreviewProps {
    images: Image[];
}

const TrendingPreview = memo(function TrendingPreview({ images }: TrendingPreviewProps) {
    if (!images.length) return null;

    return (
        <View style={styles.grid}>
            {images.map((img) => (
                <Pressable
                    key={img.id}
                    style={({ pressed }) => [styles.cell, pressed && styles.pressed]}
                    onPress={() => router.push(`/image/${img.id}` as any)}
                >
                    <ExpoImage
                        source={{ uri: img.thumbnail_url }}
                        style={styles.img}
                        placeholder={{ blurhash: img.blurhash }}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        recyclingKey={img.id}
                    />
                </Pressable>
            ))}
        </View>
    );
});

export default TrendingPreview;

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: PADDING,
        gap: GAP,
    },
    cell: {
        width: CELL,
        height: CELL,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#1a1a1a',
    },
    pressed: {
        opacity: 0.85,
    },
    img: {
        width: '100%',
        height: '100%',
    },
});
