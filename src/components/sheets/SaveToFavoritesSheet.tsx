import { Theme } from '@/constants/theme';
import { FolderIcon } from '@/src/components/icons/tab-bar/folder-icon';
import { RightArrowIcon } from '@/src/components/icons/tab-bar/right-arrow-icon';
import { StarIcon } from '@/src/components/icons/tab-bar/star-icon';
import { Text } from '@/src/components/ui';
import {
    getDefaultFolder,
    useAddToFolder,
    useFolders,
} from '@/src/hooks/useFavorites';
import type { FavoriteFolder } from '@/src/types/favorites.types';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import { Image } from 'expo-image';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    View,
    useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CreateFolderSheet, { CreateFolderSheetRef } from './CreateFolderSheet';

export interface SaveToFavoritesSheetRef {
    present: () => Promise<void>;
    dismiss: () => Promise<void>;
}

interface SaveToFavoritesSheetProps {
    imageId?: string;
    imageUrl?: string;
    onSaved?: () => void;
}

export const SaveToFavoritesSheet = forwardRef<SaveToFavoritesSheetRef, SaveToFavoritesSheetProps>(
    ({ imageId, imageUrl, onSaved }, ref) => {
        const sheetRef = useRef<TrueSheet>(null);
        const createFolderSheetRef = useRef<CreateFolderSheetRef>(null);
        const insets = useSafeAreaInsets();
        const colorScheme = useColorScheme();
        const isDark = colorScheme === 'dark';

        // API hooks
        const { data: folders, isLoading, refetch } = useFolders();
        const addToFolder = useAddToFolder();

        useImperativeHandle(ref, () => ({
            present: async () => {
                refetch(); // Refresh folders when opening
                await sheetRef.current?.present();
            },
            dismiss: async () => {
                await sheetRef.current?.dismiss();
            },
        }));

        const backgroundColor = isDark ? '#1C1C1E' : '#F2F2F7';
        const textColor = isDark ? '#FFFFFF' : '#000000';
        const secondaryTextColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';
        const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
        const cardBgColor = isDark ? '#2C2C2E' : '#FFFFFF';
        const placeholderBg = isDark ? '#3A3A3C' : '#E5E5EA';

        // Handle folder selection - save image to folder
        const handleFolderPress = async (folder: FavoriteFolder) => {
            if (!imageId) return;

            try {
                await addToFolder.mutateAsync({ folderId: folder.id, imageId });
                onSaved?.();
                sheetRef.current?.dismiss();
            } catch (error) {
                console.error('Failed to save image:', error);
            }
        };

        // Handle Quick Save - save to default folder
        const handleQuickSave = async () => {
            if (!imageId) return;

            const defaultFolder = getDefaultFolder(folders);
            if (!defaultFolder) return;

            try {
                await addToFolder.mutateAsync({ folderId: defaultFolder.id, imageId });
                onSaved?.();
                sheetRef.current?.dismiss();
            } catch (error) {
                console.error('Failed to quick save:', error);
            }
        };

        // Handle create folder
        const handleCreateFolder = () => {
            createFolderSheetRef.current?.present();
        };

        // Handle folder created - auto-save image to new folder
        const handleFolderCreated = async (folderId: string, folderName: string) => {
            if (!imageId) return;

            try {
                await addToFolder.mutateAsync({ folderId, imageId });
                onSaved?.();
                sheetRef.current?.dismiss();
            } catch (error) {
                console.error('Failed to save to new folder:', error);
            }
        };

        // Render folder list item
        const renderFolder = ({ item }: { item: FavoriteFolder }) => {
            const initial = item.name.charAt(0).toUpperCase();

            return (
                <Pressable
                    style={({ pressed }) => [
                        styles.folderItem,
                        { backgroundColor: cardBgColor },
                        pressed && { opacity: 0.7 },
                        addToFolder.isPending && { opacity: 0.5 },
                    ]}
                    onPress={() => handleFolderPress(item)}
                    disabled={addToFolder.isPending}
                >
                    {/* Cover Image */}
                    <View style={[styles.folderCover, { backgroundColor: placeholderBg }]}>
                        {item.coverImage?.thumbnailUrl ? (
                            <Image
                                source={{ uri: item.coverImage.thumbnailUrl }}
                                style={styles.coverImage}
                                contentFit="cover"
                            />
                        ) : (
                            <Text weight="bold" style={styles.placeholder}>
                                {initial}
                            </Text>
                        )}
                        {/* Default star badge */}
                        {item.isDefault && (
                            <View style={styles.defaultBadge}>
                                <StarIcon size={10} color="#fff" />
                            </View>
                        )}
                    </View>

                    {/* Folder Info */}
                    <View style={styles.folderInfo}>
                        <Text weight="semibold" style={[styles.folderName, { color: textColor }]} numberOfLines={1}>
                            {item.name}
                        </Text>
                        <Text style={[styles.folderCount, { color: secondaryTextColor }]}>
                            {item.imageCount} {item.imageCount === 1 ? 'image' : 'images'}
                        </Text>
                    </View>

                    <RightArrowIcon size={18} color={secondaryTextColor} />
                </Pressable>
            );
        };

        const listData = folders || [];

        return (
            <>
                <TrueSheet
                    ref={sheetRef}
                    detents={[0.58, 0.95]}
                    cornerRadius={24}
                    grabber={true}
                    scrollable={true}
                    backgroundColor={backgroundColor}
                    header={
                        <View style={[styles.header, { backgroundColor, borderBottomColor: borderColor }]}>
                            <Text weight="bold" style={[styles.title, { color: textColor }]}>
                                Save to Collection
                            </Text>
                            <Text style={[styles.subtitle, { color: secondaryTextColor }]}>
                                Choose a folder or create a new one
                            </Text>
                        </View>
                    }
                    footer={
                        <View style={[styles.footer, { backgroundColor, paddingBottom: insets.bottom + 10 }]}>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.quickSaveButton,
                                    { backgroundColor: Theme.colors.primary.main },
                                    pressed && styles.quickSaveButtonPressed,
                                    addToFolder.isPending && styles.buttonDisabled,
                                ]}
                                onPress={handleQuickSave}
                                disabled={addToFolder.isPending || !folders?.length}
                            >
                                {addToFolder.isPending ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <Text weight="semibold" style={styles.quickSaveText}>
                                        Quick Save to Favorites
                                    </Text>
                                )}
                            </Pressable>
                        </View>
                    }
                >
                    <View style={styles.container}>
                        {/* Create New Collection Bar */}
                        <Pressable
                            style={({ pressed }) => [
                                styles.createNewBar,
                                { backgroundColor: cardBgColor },
                                pressed && { opacity: 0.7 }
                            ]}
                            onPress={handleCreateFolder}
                        >
                            <View style={[styles.plusIconContainer, { backgroundColor: placeholderBg }]}>
                                <FolderIcon size={20} color={Theme.colors.primary.main} />
                            </View>
                            <Text weight="medium" style={[styles.createNewText, { color: textColor }]}>
                                Create New Collection
                            </Text>
                            <RightArrowIcon size={20} color={secondaryTextColor} />
                        </Pressable>

                        {isLoading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={Theme.colors.primary.main} />
                            </View>
                        ) : (
                            <FlatList
                                nestedScrollEnabled
                                data={listData}
                                renderItem={renderFolder}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={styles.listContent}
                                showsVerticalScrollIndicator={false}
                            />
                        )}
                    </View>
                </TrueSheet>

                {/* Create Folder Sheet */}
                <CreateFolderSheet
                    ref={createFolderSheetRef}
                    onCreated={handleFolderCreated}
                />
            </>
        );
    }
);

SaveToFavoritesSheet.displayName = 'SaveToFavoritesSheet';

const styles = StyleSheet.create({
    container: {
        minHeight: 300,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 6,
        alignItems: 'center',
    },
    title: {
        fontSize: 17,
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 12,
    },
    footer: {
        paddingHorizontal: 16,
        paddingTop: 7,
        paddingBottom: 5,
    },
    listContent: {
        paddingHorizontal: 10,
        paddingTop: 8,
        paddingBottom: 150,
    },
    loadingContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quickSaveButton: {
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    quickSaveButtonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    quickSaveText: {
        color: '#fff',
        fontSize: 15,
    },
    createNewBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginHorizontal: 10,
        marginTop: 8,
        marginBottom: 6,
        borderRadius: 12,
    },
    plusIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    createNewText: {
        flex: 1,
        fontSize: 15,
        marginLeft: 12,
    },
    // List item styles
    folderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginHorizontal: 0,
        marginBottom: 8,
        borderRadius: 12,
        gap: 12,
    },
    folderCover: {
        width: 48,
        height: 48,
        borderRadius: 10,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    coverImage: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        fontSize: 20,
        color: 'rgba(255,255,255,0.4)',
    },
    defaultBadge: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: Theme.colors.primary.main,
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    folderInfo: {
        flex: 1,
    },
    folderName: {
        fontSize: 15,
        marginBottom: 2,
    },
    folderCount: {
        fontSize: 12,
    },
});

export default SaveToFavoritesSheet;
