import { Text } from '@components/ui/Text';
import { Theme, Typography } from '@constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Dimensions,
    Pressable,
    StyleSheet,
    View,
} from 'react-native';
import Animated, {
    interpolate,
    SharedValue,
    useAnimatedStyle,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HERO_HEIGHT = SCREEN_HEIGHT * 0.45;

interface ProfileHeroProps {
    name: string;
    coverImageUrl: string;
    imageCount: number;
    scrollY: SharedValue<number>;
    isFavorite?: boolean;
    onFavlistPress?: () => void;
    showFavlistButton?: boolean; // Hide button until backend supports it
}

export default function ProfileHero({
    name,
    coverImageUrl,
    imageCount,
    scrollY,
    isFavorite = false,
    onFavlistPress,
    showFavlistButton = false, // Hidden by default
}: ProfileHeroProps) {
    // Parallax effect - image moves slower than scroll
    const imageAnimatedStyle = useAnimatedStyle(() => {
        const translateY = interpolate(
            scrollY.value,
            [-HERO_HEIGHT, 0, HERO_HEIGHT],
            [HERO_HEIGHT / 2, 0, -HERO_HEIGHT / 3],
            'clamp'
        );
        const scale = interpolate(
            scrollY.value,
            [-HERO_HEIGHT, 0],
            [2, 1],
            'clamp'
        );
        return {
            transform: [{ translateY }, { scale }],
        };
    });

    // Fade out content when scrolling up
    const contentAnimatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [0, HERO_HEIGHT * 0.5],
            [1, 0],
            'clamp'
        );
        return { opacity };
    });

    return (
        <View style={styles.container}>
            {/* Hero Image with Parallax */}
            <Animated.View style={[styles.imageContainer, imageAnimatedStyle]}>
                <Image
                    source={{ uri: coverImageUrl }}
                    style={styles.image}
                    contentFit="cover"
                    priority="high"
                />
            </Animated.View>

            {/* Gradient Overlay */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.85)']}
                locations={[0, 0.4, 1]}
                style={styles.gradient}
            />

            {/* Content Overlay */}
            <Animated.View style={[styles.content, contentAnimatedStyle]}>
                {/* Actress Name - Lighter weight */}
                <Text style={styles.name}>{name}</Text>

                {/* Bottom row */}
                <View style={styles.bottomRow}>
                    {/* Favlist Button */}
                    <Pressable
                        onPress={onFavlistPress}
                        style={({ pressed }) => [
                            styles.favlistButton,
                            isFavorite && styles.favlistButtonActive,
                            pressed && styles.favlistButtonPressed,
                        ]}
                    >
                        <Ionicons
                            name={isFavorite ? 'heart' : 'heart-outline'}
                            size={18}
                            color={isFavorite ? '#FFFFFF' : Theme.palette.primary}
                        />
                        <Text
                            style={[
                                styles.favlistText,
                                isFavorite && styles.favlistTextActive,
                            ]}
                        >
                            {isFavorite ? 'In Favlist' : 'Favlist'}
                        </Text>
                    </Pressable>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: HERO_HEIGHT,
        width: SCREEN_WIDTH,
        overflow: 'hidden',
    },
    imageContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        paddingHorizontal: Theme.spacing.lg,
        paddingBottom: Theme.spacing.lg,
    },
    name: {
        ...Typography.h1,
        color: '#FFFFFF',
        fontWeight: '500', // Lighter weight
        marginBottom: Theme.spacing.md,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Theme.spacing.xs,
    },
    statText: {
        ...Typography.bodySmall,
        color: 'rgba(255,255,255,0.8)',
    },
    favlistButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Theme.spacing.xs,
        paddingHorizontal: Theme.spacing.md,
        paddingVertical: Theme.spacing.sm,
        borderRadius: Theme.radius.full,
        borderWidth: 1.5,
        borderColor: Theme.palette.primary,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    favlistButtonActive: {
        backgroundColor: Theme.palette.primary,
        borderColor: Theme.palette.primary,
    },
    favlistButtonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    favlistText: {
        ...Typography.bodySmall,
        color: Theme.palette.primary,
        fontWeight: '600',
    },
    favlistTextActive: {
        color: '#FFFFFF',
    },
});

export { HERO_HEIGHT };

