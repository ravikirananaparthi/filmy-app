import * as Haptics from 'expo-haptics';
import { Heart } from 'lucide-react-native';
import React, { useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';

const LIKE_COLOR = '#FF006E';
const LIKE_COLOR_INACTIVE = 'rgba(255, 255, 255, 0.9)';
const BUTTON_SIZE = 32;

interface LikeButtonProps {
    isLiked: boolean;
    onPress: () => void;
    size?: number;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
    isLiked,
    onPress,
    size = BUTTON_SIZE,
}) => {
    const handlePress = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
    }, [onPress]);

    return (
        <Pressable
            onPress={handlePress}
            style={({ pressed }) => [
                styles.button,
                { width: size, height: size, borderRadius: size / 2 },
                pressed && styles.pressed,
            ]}
            hitSlop={8}
        >
            <Heart
                size={size * 0.55}
                color={isLiked ? LIKE_COLOR : LIKE_COLOR_INACTIVE}
                fill={isLiked ? LIKE_COLOR : 'transparent'}
                strokeWidth={2}
            />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
    },
    pressed: {
        transform: [{ scale: 0.92 }],
        opacity: 0.8,
    },
});

export default LikeButton;
