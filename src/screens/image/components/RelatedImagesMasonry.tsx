import { ImageCard } from '@/src/components/common/ImageCard';
import { Text } from '@/src/components/ui';
import useLike from '@/src/hooks/useLike';
import { router } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native';
import { useRelatedImages } from '../hooks/useRelatedImages';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_WIDTH = SCREEN_WIDTH / 2;

interface RelatedImagesMasonryProps {
    imageId: string;
    enabled?: boolean;
}

export const RelatedImagesMasonry: React.FC<RelatedImagesMasonryProps> = ({ imageId, enabled = true }) => {
    const { data: images = [], isLoading } = useRelatedImages(imageId, enabled);
    const { toggleLike } = useLike();

    const columns = useMemo(() => {
        const left: typeof images = [];
        const right: typeof images = [];
        let leftHeight = 0;
        let rightHeight = 0;

        images.forEach((image) => {
            const estimatedHeight = COLUMN_WIDTH / (image.aspect_ratio || 0.75);
            if (leftHeight <= rightHeight) {
                left.push(image);
                leftHeight += estimatedHeight;
            } else {
                right.push(image);
                rightHeight += estimatedHeight;
            }
        });

        return [left, right];
    }, [images]);

    const handleImagePress = useCallback((nextImageId: string) => {
        router.push(`/image/${nextImageId}` as any);
    }, []);

    if (isLoading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator color="#8B5CF6" />
            </View>
        );
    }

    if (!enabled && images.length === 0) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator color="#8B5CF6" />
            </View>
        );
    }

    if (images.length === 0) {
        return (
            <View style={styles.empty}>
                <Text style={styles.emptyText}>No related images yet</Text>
            </View>
        );
    }

    return (
        <View style={styles.grid}>
            {columns.map((column, columnIndex) => (
                <View key={columnIndex} style={styles.column}>
                    {column.map((image) => (
                        <ImageCard
                            key={image.id}
                            image={image}
                            actressName={image.actress?.name}
                            onLike={toggleLike}
                            onPress={handleImagePress}
                            columnWidth={COLUMN_WIDTH}
                            hideActressName
                        />
                    ))}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    loading: {
        paddingVertical: 28,
        alignItems: 'center',
    },
    empty: {
        paddingHorizontal: 4,
        paddingVertical: 20,
    },
    emptyText: {
        color: 'rgba(255,255,255,0.55)',
        fontSize: 14,
    },
    grid: {
        flexDirection: 'row',
        paddingHorizontal: 0,
    },
    column: {
        width: SCREEN_WIDTH / 2,
    },
});

export default RelatedImagesMasonry;
