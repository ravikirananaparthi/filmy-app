import { FontFamily } from '@/constants/theme';
import { FolderCard } from '@/src/components/sheets/FolderCard';
import { Text } from '@/src/components/ui';
import type { FavoriteFolder } from '@/src/types/favorites.types';
import { Ionicons } from '@expo/vector-icons';
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

import { useFolders } from './hooks';

/**
 * Screen showing all saved folders - 2 column grid layout
 */
export default function SavedFoldersScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const insets = useSafeAreaInsets();

    const { data: folders, isLoading, refetch, isRefetching } = useFolders();

    const backgroundColor = isDark ? '#000000' : '#F5F5F5';
    const textColor = isDark ? '#FFFFFF' : '#000000';
    const secondaryTextColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';

    const handleBack = useCallback(() => {
        router.back();
    }, []);

    const handleFolderPress = useCallback((folder: FavoriteFolder) => {
        router.push(`/favorites/folder/${folder.id}?name=${encodeURIComponent(folder.name)}`);
    }, []);

    const renderFolder = useCallback(({ item }: { item: FavoriteFolder }) => (
        <FolderCard
            folder={item}
            onPress={handleFolderPress}
        />
    ), [handleFolderPress]);

    return (
        <View style={[styles.container, { backgroundColor, paddingTop: insets.top }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={backgroundColor} />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={textColor} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: textColor }]}>Saved</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Content - 2 column grid */}
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={textColor} />
                </View>
            ) : !folders || folders.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="folder-outline" size={64} color={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'} />
                    <Text style={[styles.emptyText, { color: textColor }]}>No folders yet</Text>
                    <Text style={[styles.emptySubtext, { color: secondaryTextColor }]}>
                        Save images to folders for easy access
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={folders}
                    renderItem={renderFolder}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.gridContent}
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
    gridContent: {
        paddingHorizontal: 10,
        paddingBottom: 100,
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
