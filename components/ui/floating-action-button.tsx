import { useScrollContext } from '@/contexts/scroll-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
};

export const FloatingActionButton = memo(function FloatingActionButton() {
  const insets = useSafeAreaInsets();
  const { scrollY } = useScrollContext();
  const scale = useSharedValue(1);

  // Animate based on scroll - hide when scrolling down
  const animatedStyle = useAnimatedStyle(() => {
    // FAB slides down and fades when scrolling
    const translateY = interpolate(
      scrollY.value,
      [0, 100, 200],
      [0, 0, 100],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollY.value,
      [0, 100, 200],
      [1, 1, 0],
      Extrapolation.CLAMP
    );

    // Scale animation for morphing effect
    const fabScale = interpolate(
      scrollY.value,
      [0, 50],
      [1, 0.9],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateY },
        { scale: fabScale * scale.value },
      ],
      opacity,
    };
  });

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.9, SPRING_CONFIG);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, [scale]);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Add your filter/compose action here
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        { bottom: 100 + insets.bottom },
        animatedStyle,
      ]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={styles.button}
      >
        <View style={styles.gradient}>
          <Ionicons name="filter" size={24} color="#FFFFFF" />
        </View>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    zIndex: 100,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    // Shadow
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  gradient: {
    flex: 1,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
