import { CarouselScreen } from '@/src/components/carousel';
import { Text } from '@/src/components/ui';
import { flattenForYouPages, useForYouFeed } from '@/src/screens/home/hooks/useForYouFeed';
import type { Image } from '@/src/types/image.types';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

export default function ImageDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    // Use the same feed hook - shares cache with HomeScreen
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useForYouFeed({ limit: 20 });

    // Flatten all pages into single array
    const allImages: Image[] = useMemo(() => {
        return flattenForYouPages(data);
    }, [data]);

    // Find initial index
    const initialIndex = useMemo(() => {
        const index = allImages.findIndex((img) => img.id === id);
        return index >= 0 ? index : 0;
    }, [allImages, id]);

    if (allImages.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Loading...</Text>
            </View>
        );
    }

    return (
        <CarouselScreen
            images={allImages}
            initialIndex={initialIndex}
            onFetchMore={fetchNextPage}
            hasMore={hasNextPage}
            isFetchingMore={isFetchingNextPage}
        />
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
    text: { color: '#fff', fontSize: 16 },
});
