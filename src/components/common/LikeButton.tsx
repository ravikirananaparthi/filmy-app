import {
    BlurMask,
    Canvas,
    Circle,
    Easing,
    Group,
    Path,
    runTiming,
    Skia,
    useComputedValue,
    useValue
} from '@shopify/react-native-skia';
import * as Haptics from 'expo-haptics';
import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';

const LIKE_COLOR = '#FF006E';
const LIKE_COLOR_INACTIVE = 'rgba(255, 255, 255, 0.9)';
const HEART_SIZE = 24;
const BUTTON_SIZE = 40;
const PARTICLE_COUNT = 8;

// Heart path
const heartPath = Skia.Path.MakeFromSVGString(
    'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
)!;

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
    // Reanimated values for button animation
    const scale = useSharedValue(1);
    const rotation = useSharedValue(0);

    // Skia values for particle animation
    const particleProgress = useValue(0);
    const heartFill = useValue(isLiked ? 1 : 0);

    // Generate particle positions
    const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
        return {
            angle,
            delay: i * 0.05,
            size: 3 + Math.random() * 2,
        };
    });

    const handlePress = useCallback(() => {
        // Haptic feedback
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Button bounce animation
        scale.value = withSequence(
            withSpring(0.8, { damping: 10, stiffness: 400 }),
            withSpring(1.15, { damping: 8, stiffness: 300 }),
            withSpring(1, { damping: 12, stiffness: 200 })
        );

        // Rotation wiggle
        rotation.value = withSequence(
            withTiming(-15, { duration: 100 }),
            withTiming(15, { duration: 100 }),
            withTiming(-10, { duration: 80 }),
            withTiming(10, { duration: 80 }),
            withTiming(0, { duration: 100, easing: Easing.out(Easing.quad) })
        );

        // Particle burst animation
        if (!isLiked) {
            particleProgress.current = 0;
            runTiming(particleProgress, 1, {
                duration: 600,
                easing: Easing.out(Easing.cubic),
            });
        }

        // Heart fill animation
        runTiming(heartFill, isLiked ? 0 : 1, {
            duration: 300,
            easing: Easing.inOut(Easing.quad),
        });

        onPress();
    }, [isLiked, onPress, scale, rotation, particleProgress, heartFill]);

    const animatedButtonStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { rotate: `${rotation.value}deg` },
        ],
    }));

    // Computed heart color
    const heartColor = useComputedValue(() => {
        const t = heartFill.current;
        return t > 0.5 ? LIKE_COLOR : LIKE_COLOR_INACTIVE;
    }, [heartFill]);

    // Computed heart scale
    const heartScale = useComputedValue(() => {
        const t = heartFill.current;
        return 0.8 + t * 0.2;
    }, [heartFill]);

    const heartSize = size * 0.55;
    const canvasSize = size * 2;
    const center = canvasSize / 2;

    return (
        <Pressable onPress={handlePress} style={styles.pressable}>
            <Animated.View style={[styles.button, { width: size, height: size }, animatedButtonStyle]}>
                {/* Background blur */}
                <View style={[styles.buttonBackground, { borderRadius: size / 2 }]} />

                {/* Skia Canvas for heart and particles */}
                <Canvas style={[styles.canvas, { width: canvasSize, height: canvasSize }]}>
                    {/* Particle burst effect */}
                    {particles.map((particle, index) => {
                        const particleX = useComputedValue(() => {
                            const progress = Math.max(0, particleProgress.current - particle.delay);
                            const normalizedProgress = Math.min(1, progress / (1 - particle.delay));
                            const distance = normalizedProgress * size * 1.5;
                            return center + Math.cos(particle.angle) * distance;
                        }, [particleProgress]);

                        const particleY = useComputedValue(() => {
                            const progress = Math.max(0, particleProgress.current - particle.delay);
                            const normalizedProgress = Math.min(1, progress / (1 - particle.delay));
                            const distance = normalizedProgress * size * 1.5;
                            return center + Math.sin(particle.angle) * distance;
                        }, [particleProgress]);

                        const particleOpacity = useComputedValue(() => {
                            const progress = Math.max(0, particleProgress.current - particle.delay);
                            const normalizedProgress = Math.min(1, progress / (1 - particle.delay));
                            return 1 - normalizedProgress;
                        }, [particleProgress]);

                        const particleScale = useComputedValue(() => {
                            const progress = Math.max(0, particleProgress.current - particle.delay);
                            const normalizedProgress = Math.min(1, progress / (1 - particle.delay));
                            return particle.size * (1 - normalizedProgress * 0.5);
                        }, [particleProgress]);

                        return (
                            <Circle
                                key={index}
                                cx={particleX}
                                cy={particleY}
                                r={particleScale}
                                color={LIKE_COLOR}
                                opacity={particleOpacity}
                            >
                                <BlurMask blur={1} style="solid" />
                            </Circle>
                        );
                    })}

                    {/* Heart icon */}
                    <Group
                        transform={[
                            { translateX: center - heartSize / 2 },
                            { translateY: center - heartSize / 2 },
                            { scale: heartSize / 24 },
                        ]}
                    >
                        <Path
                            path={heartPath}
                            color={heartColor}
                            style="fill"
                        />
                    </Group>

                    {/* Glow effect when liked */}
                    {isLiked && (
                        <Circle
                            cx={center}
                            cy={center}
                            r={size * 0.4}
                            color={LIKE_COLOR}
                            opacity={0.15}
                        >
                            <BlurMask blur={8} style="normal" />
                        </Circle>
                    )}
                </Canvas>
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    pressable: {
        zIndex: 10,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'visible',
    },
    buttonBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    canvas: {
        position: 'absolute',
    },
});

export default LikeButton;
