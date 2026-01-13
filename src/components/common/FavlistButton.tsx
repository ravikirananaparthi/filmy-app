import { Ionicons } from '@expo/vector-icons';
import { useFavlist } from '@hooks/useFavlist';
import { useFavlistStore } from '@store/slices/favlistSlice';
import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface FavlistButtonProps {
    actressId: string;
    size?: number;
    showLabel?: boolean;
    variant?: 'icon' | 'pill'; // icon = just icon, pill = icon + text in pill shape
}

/**
 * Favlist (Follow) Button Component
 * 
 * Optimistic UI - taps instantly update state, API syncs in background.
 * Uses Zustand store as single source of truth.
 */
export const FavlistButton: React.FC<FavlistButtonProps> = memo(({
    actressId,
    size = 24,
    showLabel = false,
    variant = 'icon',
}) => {
    // Subscribe to followed state for this specific actress
    const isFollowed = useFavlistStore((state) => state.isFollowed(actressId));
    const { toggleFollow } = useFavlist();

    const handlePress = useCallback(() => {
        toggleFollow(actressId);
    }, [toggleFollow, actressId]);

    if (variant === 'pill') {
        return (
            <Pressable
                onPress={handlePress}
                style={({ pressed }) => [
                    styles.pillContainer,
                    isFollowed ? styles.pillFollowing : styles.pillFollow,
                    pressed && styles.pressed,
                ]}
            >
                <Ionicons
                    name={isFollowed ? 'checkmark' : 'add'}
                    size={size - 4}
                    color={isFollowed ? '#000' : '#fff'}
                />
                <Text style={[
                    styles.pillText,
                    isFollowed ? styles.pillTextFollowing : styles.pillTextFollow,
                ]}>
                    {isFollowed ? 'Following' : 'Follow'}
                </Text>
            </Pressable>
        );
    }

    // Icon variant (default)
    return (
        <Pressable
            onPress={handlePress}
            style={({ pressed }) => [
                styles.iconContainer,
                pressed && styles.pressed,
            ]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            <View style={[
                styles.iconBackground,
                isFollowed && styles.iconBackgroundFollowing,
            ]}>
                <Ionicons
                    name={isFollowed ? 'heart' : 'heart-outline'}
                    size={size}
                    color={isFollowed ? '#FF3B5C' : '#fff'}
                />
            </View>
            {showLabel && (
                <Text style={styles.label}>
                    {isFollowed ? 'Following' : 'Follow'}
                </Text>
            )}
        </Pressable>
    );
});

FavlistButton.displayName = 'FavlistButton';

const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
    },
    iconBackground: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBackgroundFollowing: {
        backgroundColor: 'rgba(255, 59, 92, 0.2)',
    },
    label: {
        marginTop: 4,
        fontSize: 12,
        color: '#fff',
        fontWeight: '500',
    },
    pressed: {
        opacity: 0.7,
        transform: [{ scale: 0.95 }],
    },
    // Pill variant styles
    pillContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 4,
    },
    pillFollow: {
        backgroundColor: '#FF3B5C',
    },
    pillFollowing: {
        backgroundColor: '#fff',
    },
    pillText: {
        fontSize: 14,
        fontWeight: '600',
    },
    pillTextFollow: {
        color: '#fff',
    },
    pillTextFollowing: {
        color: '#000',
    },
});

export default FavlistButton;
