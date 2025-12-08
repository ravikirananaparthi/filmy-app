import { ThemedText } from '@/components/themed-text';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    SharedValue,
    useAnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AnimatedHeaderProps {
  title: string;
  subtitle?: string;
  scrollY: SharedValue<number>;
}

export const AnimatedHeader = memo(function AnimatedHeader({
  title,
  subtitle,
  scrollY,
}: AnimatedHeaderProps) {
  const insets = useSafeAreaInsets();

  // Header animates based on scroll
  const animatedStyle = useAnimatedStyle(() => {
    // Translate up when scrolling
    const translateY = interpolate(
      scrollY.value,
      [0, 100],
      [0, -30],
      Extrapolation.CLAMP
    );

    // Fade slightly when scrolling
    const opacity = interpolate(
      scrollY.value,
      [0, 80],
      [1, 0.85],
      Extrapolation.CLAMP
    );

    // Scale down slightly
    const scale = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0.95],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateY },
        { scale },
      ],
      opacity,
    };
  });

  // Background blur/fade effect
  const backgroundStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 50],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { paddingTop: insets.top + 16 },
        animatedStyle,
      ]}
    >
      {/* Background that fades in on scroll */}
      <Animated.View style={[styles.background, backgroundStyle]} />
      
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          {title}
        </ThemedText>
        {subtitle && (
          <ThemedText style={styles.subtitle}>
            {subtitle}
          </ThemedText>
        )}
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 15, 25, 0.9)',
  },
  content: {
    gap: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});
