import { FontFamily } from '@/constants/theme';
import MasonryImageGrid from '@/src/components/common/MasonryImageGrid';
import { ShimmerGrid } from '@/src/components/common/ShimmerPlaceholder';
import { Text } from '@/src/components/ui';
import type { Actress } from '@/src/types/actress.types';
import type { Image as ImageType } from '@/src/types/image.types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
    useColorScheme,
} from 'react-native';

interface SearchResultsProps {
    query: string;
    actresses: Actress[];
    images: ImageType[];
    isLoading: boolean;
    isFetchingMore: boolean;
    onActressPress: (actress: Actress) => void;
    onImagePress: (imageId: string) => void;
    onLike: (imageId: string) => void;
    onEndReached: () => void;
}

/**
 * Search results component showing actresses and images
 * Actresses: Full-width rectangular cards in a scrollable list
 * Images: MasonryGrid without actress names
 */
export function SearchResults({
    query,
    actresses,
    images,
    isLoading,
    isFetchingMore,
    onActressPress,
    onImagePress,
    onLike,
    onEndReached,
}: SearchResultsProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const textColor = isDark ? '#FFFFFF' : '#000000';
    const borderColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
    const secondaryTextColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';
    const cardBgColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';

    const hasResults = actresses.length > 0 || images.length > 0;

    // Show shimmer when loading a new search query
    if (isLoading) {
        return <ShimmerGrid count={6} />;
    }

    if (!hasResults) {
        return (
            <View style={styles.emptyState}>
                <Ionicons name="search" size={48} color={secondaryTextColor} />
                <Text style={[styles.emptyText, { color: secondaryTextColor }]}>
                    No results found for "{query}"
                </Text>
            </View>
        );
    }

    // Create actress cards as header component for masonry
    const ActressListHeader = actresses.length > 0 ? (
        <View style={styles.actressesSection}>
            {actresses.map((actress) => (
                <Pressable
                    key={actress.id}
                    style={[styles.actressCard, { backgroundColor: cardBgColor, borderColor }]}
                    onPress={() => onActressPress(actress)}
                >
                    <Image
                        source={{ uri: actress.cover_image_url }}
                        style={styles.actressImage}
                        resizeMode="cover"
                    />
                    <View style={styles.actressInfo}>
                        <Text style={[styles.actressName, { color: textColor }]} numberOfLines={1}>
                            {actress.name}
                        </Text>
                        {actress.image_count !== undefined && (
                            <Text style={[styles.actressCount, { color: secondaryTextColor }]}>
                                {actress.image_count} wallpapers
                            </Text>
                        )}
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={secondaryTextColor} />
                </Pressable>
            ))}
        </View>
    ) : null;

    return (
        <View style={styles.container}>
            {images.length > 0 ? (
                <MasonryImageGrid
                    data={images}
                    onLike={onLike}
                    onImagePress={onImagePress}
                    onEndReached={onEndReached}
                    isLoading={isFetchingMore}
                    hideActressName={true}
                    ListHeaderComponent={ActressListHeader}
                />
            ) : (
                // Only actresses, no images
                <ScrollView style={styles.scrollContainer}>
                    {ActressListHeader}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
    },
    actressesSection: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
        gap: 10,
    },
    actressCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        gap: 12,
    },
    actressImage: {
        width: 56,
        height: 56,
        borderRadius: 8,
        backgroundColor: 'rgba(128,128,128,0.2)',
    },
    actressInfo: {
        flex: 1,
    },
    actressName: {
        fontSize: 16,
        fontFamily: FontFamily.semibold,
    },
    actressCount: {
        fontSize: 13,
        fontFamily: FontFamily.regular,
        marginTop: 2,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
        gap: 16,
    },
    emptyText: {
        fontSize: 16,
        fontFamily: FontFamily.regular,
        textAlign: 'center',
        paddingHorizontal: 32,
    },
});
