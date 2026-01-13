/**
 * FolderCard Component
 * 2-column grid item for folder display
 * Shows cover image or placeholder with name
 */
import { Theme } from '@/constants/theme';
import { StarIcon } from '@/src/components/icons/tab-bar/star-icon';
import { Text } from '@/src/components/ui';
import type { FavoriteFolder } from '@/src/types/favorites.types';
import React from 'react';
import { Image, Pressable, StyleSheet, View, useColorScheme } from 'react-native';

interface FolderCardProps {
    folder: FavoriteFolder;
    onPress: (folder: FavoriteFolder) => void;
    isLoading?: boolean;
}

export const FolderCard: React.FC<FolderCardProps> = ({ folder, onPress, isLoading }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const cardBg = isDark ? '#2C2C2E' : '#FFFFFF';
    const textColor = isDark ? '#FFFFFF' : '#000000';
    const secondaryColor = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
    const placeholderBg = isDark ? '#3A3A3C' : '#E5E5EA';

    // Get first letter for placeholder
    const initial = folder.name.charAt(0).toUpperCase();

    return (
        <View style={styles.container}>
            <Pressable
                style={({ pressed }) => [
                    styles.card,
                    { backgroundColor: cardBg },
                    folder.isDefault && {
                        borderWidth: 2,
                        borderColor: Theme.colors.primary.light,
                    },
                    pressed && styles.pressed,
                    isLoading && styles.loading,
                ]}
                onPress={() => onPress(folder)}
                disabled={isLoading}
            >
                {/* Cover Image or Placeholder */}
                <View style={[styles.coverContainer, { backgroundColor: placeholderBg }]}>
                    {folder.coverImage?.thumbnailUrl ? (
                        <Image
                            source={{ uri: folder.coverImage.thumbnailUrl }}
                            style={styles.coverImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <Text weight="bold" style={styles.placeholder}>
                            {initial}
                        </Text>
                    )}
                    {/* Default badge */}
                    {folder.isDefault && (
                        <View style={styles.defaultBadge}>
                            <StarIcon size={14} color="#fff" />
                        </View>
                    )}
                </View>

                {/* Folder Info */}
                <View style={styles.info}>
                    <Text weight="semibold" style={[styles.name, { color: textColor }]} numberOfLines={1}>
                        {folder.name}
                    </Text>
                    <Text style={[styles.count, { color: secondaryColor }]}>
                        {folder.imageCount} {folder.imageCount === 1 ? 'image' : 'images'}
                    </Text>
                </View>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '50%',
        padding: 6,
    },
    card: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    pressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    loading: {
        opacity: 0.6,
    },
    coverContainer: {
        aspectRatio: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    coverImage: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        fontSize: 32,
        color: 'rgba(255,255,255,0.4)',
    },
    defaultBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: Theme.colors.primary.main,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: {
        padding: 10,
    },
    name: {
        fontSize: 14,
        marginBottom: 2,
    },
    count: {
        fontSize: 12,
    },
});

export default FolderCard;
