import { FavoritesIcon } from '@/components/icons/tab-bar/favorites-icon';
import { FavoritesIconUF } from '@/components/icons/tab-bar/favorites-icon-uf';
import { useLikesStore } from '@store/slices/likesSlice';
import React, { useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';

const LIKE_COLOR = '#ff4757';
const LIKE_COLOR_INACTIVE = 'rgba(255, 255, 255, 0.9)';
const BUTTON_SIZE = 40;

interface LikeButtonProps {
    imageId: string;
    onLikePress: (imageId: string) => void;
    size?: number;
    activeColor?: string;
    inactiveColor?: string;
}

/**
 * Like button that reads directly from Zustand store
 * 
 * Instagram/Pinterest-style behavior:
 * 1. Always shows current state from store (instant updates)
 * 2. No loading states - button is always interactive
 * 3. Haptic feedback handled by useLike hook
 */
export const LikeButton: React.FC<LikeButtonProps> = ({
    imageId,
    onLikePress,
    size = BUTTON_SIZE,
    activeColor = LIKE_COLOR,
    inactiveColor = LIKE_COLOR_INACTIVE,
}) => {
    // Read directly from Zustand store - auto-updates when store changes
    const isLiked = useLikesStore((state) => state.likedImages.get(imageId) || false);

    const handlePress = useCallback(() => {
        // Simply trigger the like action - no debouncing or blocking here
        // All logic is handled in useLike hook
        onLikePress(imageId);
    }, [imageId, onLikePress]);

    return (
        <Pressable
            onPressIn={handlePress}
            style={({ pressed }) => [
                styles.button,
                { width: size, height: size },
                pressed && styles.pressed,
            ]}
            hitSlop={12}
            unstable_pressDelay={0}
        >
            {isLiked ? (
                <FavoritesIcon size={size * 0.6} color={activeColor} />
            ) : (
                <FavoritesIconUF size={size * 0.6} color={inactiveColor} />
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: 20,
        padding: 4,
    },
    pressed: {
        transform: [{ scale: 0.92 }],
        opacity: 0.9,
    },
});

export default LikeButton;
