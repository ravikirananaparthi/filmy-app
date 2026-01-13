import { FavlistButton } from '@components/common/FavlistButton';
import { Text } from '@components/ui/Text';
import { Theme, Typography } from '@constants/theme';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
} from 'react-native';
import Animated, {
    interpolate,
    SharedValue,
    useAnimatedStyle,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HERO_HEIGHT = SCREEN_HEIGHT * 0.65;
const GRADIENT_HEIGHT = 50;

interface ProfileHeroProps {
    actressId: string;
    name: string;
    coverImageUrl: string;
    scrollY: SharedValue<number>;
}

export default function ProfileHero({
    actressId,
    name,
    coverImageUrl,
    scrollY,
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

            {/* Main Gradient Overlay */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.85)']}
                locations={[0, 0.4, 1]}
                style={styles.gradient}
            />

            {/* Content Overlay - Name and Favlist in Row */}
            <Animated.View style={[styles.content, contentAnimatedStyle]}>
                <View style={styles.bottomRow}>
                    {/* Actress Name */}
                    <Text style={styles.name}>{name}</Text>

                    {/* Favlist Button - uses Zustand store for state */}
                    <FavlistButton
                        actressId={actressId}
                        variant="pill"
                    />
                </View>
            </Animated.View>

            {/* Bottom Gradient Separator - Dark fade to tabs */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.95)', '#000000']}
                locations={[0, 0.6, 1]}
                style={styles.bottomGradient}
            />
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
        ...StyleSheet.absoluteFillObject,
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        paddingHorizontal: Theme.spacing.lg,
        paddingBottom: Theme.spacing.xl + GRADIENT_HEIGHT / 2,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        ...Typography.h2,
        color: '#FFFFFF',
        fontWeight: '500',
        flex: 1,
        marginRight: Theme.spacing.md,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    bottomGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: GRADIENT_HEIGHT,
    },
});

export { HERO_HEIGHT };

