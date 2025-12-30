import { FavoritesIcon } from '@/components/icons/tab-bar/favorites-icon';
import { FavoritesIconUF } from '@/components/icons/tab-bar/favorites-icon-uf';
import { BookmarkFilledIcon } from '@/components/icons/ui-icons/bookmark-filled';
import { BookmarkIcon } from '@/components/icons/ui-icons/bookmark-icon';
import { DownloadIcon } from '@/components/icons/ui-icons/download';
import { DownloadFilledIcon } from '@/components/icons/ui-icons/download-filled';
import { Text } from '@/src/components/ui';
import { useLikesStore } from '@store/slices/likesSlice';
import React, { memo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BottomBarProps {
    actressName: string;
    imageId: string;
    onDownloadPress?: () => void;
    onBookmarkPress?: () => void;
    onLikePress: (imageId: string) => void;
}

// Icon button size
const BUTTON_SIZE = 48;
const BUTTON_RADIUS = 24;

/**
 * BottomBar - Floating elements layout:
 *                    [Like Button] (floating above)
 * [Download] [Actress Name Pill] [Bookmark]
 */
export const BottomBar: React.FC<BottomBarProps> = memo(({
    actressName,
    imageId,
    onDownloadPress,
    onBookmarkPress,
    onLikePress,
}) => {
    const insets = useSafeAreaInsets();
    const [isDownloaded, setIsDownloaded] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    // Get like state from store
    const isLiked = useLikesStore((state) => state.likedImages.get(imageId) ?? false);

    const handleDownload = () => {
        setIsDownloaded(true);
        onDownloadPress?.();
    };

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
        onBookmarkPress?.();
    };

    const handleLike = () => {
        onLikePress(imageId);
    };

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom + 12 }]}>
            {/* Like Button - Floating above, right side */}
            <View style={styles.likeButtonWrapper}>
                <Pressable
                    style={[styles.iconButton, isLiked && styles.iconButtonActive]}
                    onPress={handleLike}
                    hitSlop={12}
                >
                    {isLiked ? (
                        <FavoritesIcon size={24} color="#ff4757" />
                    ) : (
                        <FavoritesIconUF size={24} color="rgba(255, 255, 255, 0.9)" />
                    )}
                </Pressable>
            </View>

            {/* Bottom Row: Download | Name Pill | Bookmark */}
            <View style={styles.bottomRow}>
                {/* Download Button */}
                <Pressable
                    style={styles.iconButton}
                    onPress={handleDownload}
                    hitSlop={12}
                >
                    {isDownloaded ? (
                        <DownloadFilledIcon size={24} color="#fff" />
                    ) : (
                        <DownloadIcon size={24} color="rgba(255, 255, 255, 0.9)" />
                    )}
                </Pressable>

                {/* Actress Name Pill */}
                <View style={styles.namePill}>
                    <Text weight="semibold" style={styles.actressName} numberOfLines={1}>
                        {actressName}
                    </Text>
                </View>

                {/* Bookmark Button */}
                <Pressable
                    style={styles.iconButton}
                    onPress={handleBookmark}
                    hitSlop={12}
                >
                    {isBookmarked ? (
                        <BookmarkFilledIcon size={24} color="#ffc107" />
                    ) : (
                        <BookmarkIcon size={24} color="#ffc107" />
                    )}
                </Pressable>
            </View>
        </View>
    );
});

BottomBar.displayName = 'BottomBar';

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        paddingHorizontal: 16,
    },
    likeButtonWrapper: {
        alignItems: 'flex-end',
        marginBottom: 12,
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconButton: {
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        borderRadius: BUTTON_RADIUS,
        backgroundColor: '#1e1e1e',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    iconButtonActive: {
        backgroundColor: '#2a2a2a',
    },
    namePill: {
        flex: 1,
        height: BUTTON_SIZE,
        borderRadius: BUTTON_RADIUS,
        backgroundColor: '#1e1e1e',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    actressName: {
        fontSize: 15,
        color: '#fff',
        textAlign: 'center',
    },
});

export default BottomBar;
