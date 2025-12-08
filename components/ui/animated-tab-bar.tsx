import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import React, { memo, useCallback } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_BAR_MARGIN = 16;
const TAB_BAR_HEIGHT = 68;
const TAB_ITEM_SIZE = 52;

// Spring config - optimized for performance
const SPRING_CONFIG = {
  damping: 15,
  stiffness: 180,
  mass: 0.5,
};

interface AnimatedTabItemProps {
  focused: boolean;
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  onLongPress: () => void;
}

const AnimatedTabItem = memo(function AnimatedTabItem({
  focused,
  icon,
  label,
  onPress,
  onLongPress,
}: AnimatedTabItemProps) {
  const progress = useSharedValue(focused ? 1 : 0);

  React.useEffect(() => {
    progress.value = withSpring(focused ? 1 : 0, SPRING_CONFIG);
  }, [focused, progress]);

  const containerStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(progress.value, [0, 1], [TAB_ITEM_SIZE, TAB_ITEM_SIZE + 20], Extrapolation.CLAMP),
      height: TAB_ITEM_SIZE,
    };
  });

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(progress.value, [0, 1], [1, 1.1], Extrapolation.CLAMP) },
      { translateY: interpolate(progress.value, [0, 1], [0, -2], Extrapolation.CLAMP) },
    ],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { scale: interpolate(progress.value, [0, 1], [0.8, 1], Extrapolation.CLAMP) },
    ],
  }));

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { scale: interpolate(progress.value, [0, 1], [0.9, 1], Extrapolation.CLAMP) },
    ],
  }));

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
      accessibilityLabel={label}
      onPress={handlePress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
    >
      <Animated.View style={[styles.tabItem, containerStyle]}>
        {/* Background */}
        <Animated.View style={[styles.tabBackground, backgroundStyle]} />

        {/* Icon */}
        <Animated.View style={[styles.iconContainer, iconStyle]}>
          {icon}
        </Animated.View>

        {/* Label */}
        {focused && (
          <Animated.Text style={[styles.label, labelStyle]}>{label}</Animated.Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
});

// Main TabBar component - NOT wrapped in memo to avoid the "Component is not a function" error
export function AnimatedTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.tabBarWrapper}>
        {/* Background */}
        <View style={styles.background} />
        
        {/* Border glow */}
        <View style={styles.glowBorder} />

        {/* Tab items */}
        <View style={styles.tabBarContent}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? String(options.tabBarLabel)
                : options.title !== undefined
                ? options.title
                : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            const iconColor = isFocused ? '#FFFFFF' : 'rgba(156, 163, 175, 0.8)';

            return (
              <AnimatedTabItem
                key={route.key}
                focused={isFocused}
                icon={
                  options.tabBarIcon?.({
                    focused: isFocused,
                    color: iconColor,
                    size: 22,
                  }) ?? null
                }
                label={label}
                onPress={onPress}
                onLongPress={onLongPress}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: TAB_BAR_MARGIN,
    paddingTop: 8,
  },
  tabBarWrapper: {
    height: TAB_BAR_HEIGHT,
    borderRadius: 24,
    overflow: 'hidden',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 15, 25, 0.95)',
    borderRadius: 24,
  },
  glowBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  tabBarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingHorizontal: 8,
  },
  tabBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#8B5CF6',
    borderRadius: 14,
  },
  iconContainer: {
    zIndex: 10,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 2,
    zIndex: 10,
  },
});
