import type { Image } from '@/src/types/image.types';
import { MasonryImageGrid } from '@components/common/MasonryImageGrid';
import { Theme } from '@constants/theme';
import useLike from '@hooks/useLike';
import { router } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useUserUploads } from '../hooks/useUserUploads';
import { ProfileHeader } from './ProfileHeader';

function EmptyPinsState() {
    const isDark = useColorScheme() === 'dark';
    return (
        <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: isDark ? '#999' : '#666' }]}>
                No pins yet — upload your first image!
            </Text>
        </View>
    );
}

export function PinsGrid() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const bgColor = isDark ? Theme.colors.background.dark : Theme.colors.background.light;

    const { data, isLoading, fetchNextPage, hasNextPage } = useUserUploads();
    const { toggleLike } = useLike();

    const flatImages: Image[] = useMemo(
        () => data?.pages.flatMap((p) => p.data as Image[]) ?? [],
        [data]
    );

    const isFirstLoad = isLoading && flatImages.length === 0;
    const isEmpty = !isLoading && flatImages.length === 0;

    const handleImagePress = useCallback((id: string) => {
        router.push(`/image/${id}` as any);
    }, []);

    const handleLike = useCallback((id: string) => toggleLike(id), [toggleLike]);

    const handleEndReached = useCallback(() => {
        if (hasNextPage) fetchNextPage();
    }, [hasNextPage, fetchNextPage]);

    const ProfileHeaderMemo = useMemo(() => <ProfileHeader />, []);

    // Loading or empty: show header + state message (no MasonryImageGrid to avoid early return hiding header)
    if (isFirstLoad || isEmpty) {
        return (
            <ScrollView
                style={[styles.fallbackScroll, { backgroundColor: bgColor }]}
                showsVerticalScrollIndicator={false}
            >
                <ProfileHeader />
                {isEmpty && <EmptyPinsState />}
            </ScrollView>
        );
    }

    return (
        <MasonryImageGrid
            data={flatImages}
            onLike={handleLike}
            onImagePress={handleImagePress}
            isLoading={false}
            onEndReached={handleEndReached}
            ListHeaderComponent={ProfileHeaderMemo}
        />
    );
}

const styles = StyleSheet.create({
    fallbackScroll: {
        flex: 1,
    },
    emptyContainer: {
        marginTop: 60,
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyText: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
    },
});
