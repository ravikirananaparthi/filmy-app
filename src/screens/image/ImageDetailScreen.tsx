import { CarouselScreen } from '@/src/components/carousel';
import type { Image } from '@/src/types/image.types';
import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ImageDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const queryClient = useQueryClient();

    const cachedData = queryClient.getQueryData(['feed', 'for-you', { limit: 20 }]) as any;

    const allImages: Image[] = useMemo(() => {
        if (!cachedData?.pages) return [];
        return cachedData.pages.flatMap((page: any) => page.data || []);
    }, [cachedData]);

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

    return <CarouselScreen images={allImages} initialIndex={initialIndex} />;
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
    text: { color: '#fff', fontSize: 16 },
});
