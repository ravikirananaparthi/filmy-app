import React from 'react';
import {
    Image,
    Pressable,
    StyleSheet,
    useColorScheme,
} from 'react-native';

const CARD_WIDTH = 140;
const CARD_HEIGHT = 200;

interface ActressMiniCardProps {
    imageUrl: string;
    onPress?: () => void;
}

/**
 * Mini card for actress row.
 * No text overlay, slight dim effect.
 */
export default function ActressMiniCard({
    imageUrl,
    onPress,
}: ActressMiniCardProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.container,
                pressed && styles.pressed,
            ]}
        >
            <Image
                source={{ uri: imageUrl }}
                style={[
                    styles.image,
                    { opacity: 0.95 },
                ]}
                resizeMode="cover"
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#1A1A1A',
    },
    pressed: {
        transform: [{ scale: 0.99 }],
    },
    image: {
        width: '100%',
        height: '100%',
    },
});
