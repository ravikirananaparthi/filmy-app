import { FontFamily, Theme } from '@/constants/theme';
import { Text } from '@/src/components/ui';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    ImageBackground,
    Pressable,
    StyleSheet,
    View,
    useColorScheme
} from 'react-native';

const CARD_HEIGHT = 420;

interface HighlightCardProps {
    imageUrl: string;
    name: string;
    caption?: string;
    onPress?: () => void;
}

/**
 * Featured carousel card with gradient overlay.
 * Apple TV / Apple Movies style.
 */
export default function HighlightCard({
    imageUrl,
    name,
    caption,
    onPress,
}: HighlightCardProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.container,
            ]}
        >
            <ImageBackground
                source={{ uri: imageUrl }}
                style={styles.image}
                imageStyle={styles.imageStyle}
                resizeMode="cover"
            >
                {/* Gradient overlay */}
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.gradient}
                >
                    <View style={styles.content}>
                        <Text
                            style={[
                                styles.name,
                                { fontFamily: FontFamily.semibold },
                            ]}
                            numberOfLines={1}
                        >
                            {name}
                        </Text>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: CARD_HEIGHT,
        borderRadius: 20,
        overflow: 'hidden',
        // iOS shadow
        ...Theme.shadows.featured,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imageStyle: {
        borderRadius: 20,
    },
    gradient: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    content: {
        padding: 16,
        paddingBottom: 20,
    },
    name: {
        fontSize: 22,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});
