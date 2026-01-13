import { FontFamily, Theme } from '@/constants/theme';
import { Text } from '@/src/components/ui';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    View,
    useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FollowingCard, PreviewCard } from './components';
import { useFavoritesPreview } from './hooks';

/**
 * Favorites home screen
 * Shows Liked, Saved, and Following preview cards
 */
export default function FavoritesScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const insets = useSafeAreaInsets();

    const { data: preview, isLoading, error, refetch, isRefetching } = useFavoritesPreview();

    const backgroundColor = isDark ? '#000000' : '#F5F5F5';
    const textColor = isDark ? '#FFFFFF' : '#000000';

    const handleLikedPress = useCallback(() => {
        router.push('/favorites/liked');
    }, []);

    const handleSavedPress = useCallback(() => {
        router.push('/favorites/saved');
    }, []);

    const handleFollowingPress = useCallback(() => {
        router.push('/favorites/following');
    }, []);

    if (isLoading) {
        return (
            <View style={[styles.container, styles.centered, { backgroundColor, paddingTop: insets.top }]}>
                <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={backgroundColor} />
                <ActivityIndicator size="large" color={textColor} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, styles.centered, { backgroundColor, paddingTop: insets.top }]}>
                <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={backgroundColor} />
                <Text style={[styles.errorText, { color: textColor }]}>Failed to load favorites</Text>
            </View>
        );
    }

    const likedImages = preview?.liked?.images || [];
    const likedCount = preview?.liked?.totalCount || 0;
    const savedImages = preview?.saved?.images || [];
    const savedCount = preview?.saved?.totalCount || 0;
    const following = preview?.following || [];

    return (
        <View style={[styles.container, { backgroundColor, paddingTop: insets.top }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={backgroundColor} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: textColor }]}>Favorites</Text>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={refetch}
                        tintColor={Theme.colors.primary.main}
                        colors={[Theme.colors.primary.main]}
                    />
                }
            >
                {/* Liked Card */}
                <PreviewCard
                    title="Liked"
                    count={likedCount}
                    images={likedImages}
                    accentColor="#FF6B8A"
                    iconName="heart"
                    onPress={handleLikedPress}
                />

                {/* Saved Card */}
                <PreviewCard
                    title="Saved"
                    count={savedCount}
                    images={savedImages}
                    accentColor="#8B9DFF"
                    iconName="bookmark"
                    onPress={handleSavedPress}
                />

                {/* Following Card */}
                <FollowingCard
                    profiles={following}
                    accentColor="#4ECDC4"
                    onPress={handleFollowingPress}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: FontFamily.bold,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 100,
    },
    errorText: {
        fontSize: 16,
        fontFamily: FontFamily.regular,
    },
});
