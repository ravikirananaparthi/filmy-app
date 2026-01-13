import { FontFamily } from '@/constants/theme';
import { Text } from '@/src/components/ui';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StatusBar,
    StyleSheet,
    View,
    useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFavoritesPreview } from './hooks';

/**
 * Screen showing all followed actress profiles
 */
export default function FollowingScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const insets = useSafeAreaInsets();

    // Use the existing preview hook (since following comes from preview API)
    const { data: preview, isLoading, refetch, isRefetching } = useFavoritesPreview();

    const following = preview?.following || [];

    const backgroundColor = isDark ? '#000000' : '#F5F5F5';
    const textColor = isDark ? '#FFFFFF' : '#000000';
    const secondaryTextColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';
    const cardBgColor = isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF';

    const handleBack = useCallback(() => {
        router.back();
    }, []);

    const handleProfilePress = useCallback((profile: { id: string; name: string }) => {
        router.push(`/actress/${profile.id}`);
    }, []);

    const renderProfile = useCallback(({ item }: { item: { id: string; name: string; coverImageUrl: string } }) => (
        <Pressable
            style={[styles.profileCard, { backgroundColor: cardBgColor }]}
            onPress={() => handleProfilePress(item)}
        >
            <Image
                source={{ uri: item.coverImageUrl }}
                style={styles.profileImage}
                contentFit="cover"
            />
            <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: textColor }]} numberOfLines={1}>
                    {item.name}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={secondaryTextColor} />
        </Pressable>
    ), [cardBgColor, textColor, secondaryTextColor, handleProfilePress]);

    return (
        <View style={[styles.container, { backgroundColor, paddingTop: insets.top }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={backgroundColor} />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={textColor} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: textColor }]}>Following</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Content */}
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={textColor} />
                </View>
            ) : following.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="people-outline" size={64} color={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'} />
                    <Text style={[styles.emptyText, { color: textColor }]}>Not following anyone yet</Text>
                    <Text style={[styles.emptySubtext, { color: secondaryTextColor }]}>
                        Follow your favorite actresses to see them here
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={following}
                    renderItem={renderProfile}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshing={isRefetching}
                    onRefresh={refetch}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: FontFamily.semibold,
    },
    placeholder: {
        width: 32,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        marginBottom: 12,
        gap: 12,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#eee',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 16,
        fontFamily: FontFamily.semibold,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        gap: 12,
    },
    emptyText: {
        fontSize: 18,
        fontFamily: FontFamily.semibold,
        marginTop: 8,
    },
    emptySubtext: {
        fontSize: 14,
        fontFamily: FontFamily.regular,
        textAlign: 'center',
    },
});
