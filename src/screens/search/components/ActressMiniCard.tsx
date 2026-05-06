import { Text } from '@/src/components/ui';
import { FontFamily } from '@/constants/theme';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, View, useColorScheme } from 'react-native';

const CARD_WIDTH = 140;
const CARD_HEIGHT = 200;

interface ActressMiniCardProps {
    imageUrl: string;
    name?: string;
    onPress?: () => void;
}

/**
 * Mini card for creator/profile row.
 * Rounded image + optional name label below.
 */
export default function ActressMiniCard({
    imageUrl,
    name,
    onPress,
}: ActressMiniCardProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const nameColor = isDark ? 'rgba(255,255,255,0.82)' : 'rgba(0,0,0,0.78)';

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.container,
                pressed && styles.pressed,
            ]}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    contentFit="cover"
                    recyclingKey={imageUrl}
                    transition={200}
                />
            </View>
            {name ? (
                <Text
                    style={[styles.name, { color: nameColor }]}
                    numberOfLines={1}
                >
                    {name}
                </Text>
            ) : null}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        alignItems: 'center',
    },
    pressed: {
        transform: [{ scale: 0.97 }],
        opacity: 0.9,
    },
    imageContainer: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#1A1A1A',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    name: {
        marginTop: 7,
        fontSize: 12,
        fontFamily: FontFamily.medium,
        textAlign: 'center',
        paddingHorizontal: 4,
    },
});
