import {
  FavoritesIcon,
  FavoritesIconUF,
  HomeIcon,
  HomeIconUF,
  MenuIcon,
  MenuIconUF,
  SearchIcon,
  SearchIconUF,
  TrendingIcon,
  TrendingIconUF,
} from '@/components/icons/tab-bar';
import { Theme } from '@/constants/theme';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import React, { memo, useCallback, useEffect } from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_BAR_MARGIN = 20; // Reduced margin for wider bar
const TAB_BAR_HEIGHT = 62;
const TAB_COUNT = 5;
const TAB_BAR_WIDTH = SCREEN_WIDTH - TAB_BAR_MARGIN * 2;

const TAB_ITEM_WIDTH = TAB_BAR_WIDTH / TAB_COUNT;
const INDICATOR_SIZE = 50;
const INDICATOR_PADDING = (TAB_ITEM_WIDTH - INDICATOR_SIZE) / 2;

// Spring config for smooth, snappy animations
const SPRING_CONFIG = {
  damping: 25,
  stiffness: 250,
  mass: 0.8,
};

// Icon mapping for filled and unfilled states
const TAB_ICONS: Record<string, { filled: React.FC<any>; unfilled: React.FC<any> }> = {
  index: { filled: HomeIcon, unfilled: HomeIconUF },
  trending: { filled: TrendingIcon, unfilled: TrendingIconUF },
  search: { filled: SearchIcon, unfilled: SearchIconUF },
  favorites: { filled: FavoritesIcon, unfilled: FavoritesIconUF },
  menu: { filled: MenuIcon, unfilled: MenuIconUF },
};

interface TabItemProps {
  routeName: string;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  label: string;
}

const TabItem = memo(function TabItem({
  routeName,
  isFocused,
  onPress,
  onLongPress,
  label,
}: TabItemProps) {
  const colorScheme = useColorScheme();

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  // Get the appropriate icon component
  const iconConfig = TAB_ICONS[routeName];
  if (!iconConfig) return null;

  const IconComponent = isFocused ? iconConfig.filled : iconConfig.unfilled;

  // Icon colors - Reference shows White for active, Grey for inactive
  const iconColor = '#FFFFFF';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={label}
      onPress={handlePress}
      onLongPress={onLongPress}
      style={styles.tabItem}
    >
      <IconComponent size={24} color={iconColor} />
    </Pressable>
  );
});

export function AnimatedTabBar({ state, descriptors, navigation, onHomeDoubleTap }: BottomTabBarProps & { onHomeDoubleTap?: () => void }) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  // Reference implies dark bar in BOTH modes
  const isDark = true;

  // Animated position of the sliding indicator
  const indicatorPosition = useSharedValue(state.index * TAB_ITEM_WIDTH + INDICATOR_PADDING);

  // Update indicator position when tab changes
  useEffect(() => {
    indicatorPosition.value = withSpring(
      state.index * TAB_ITEM_WIDTH + INDICATOR_PADDING,
      SPRING_CONFIG
    );
  }, [state.index, indicatorPosition]);

  // Animated style for the sliding indicator
  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorPosition.value }],
  }));

  // Theme overrides for the specific "Artistry" look
  const tabBarBackground = '#121212'; // Deep matte black
  const indicatorColor = Theme.palette.primary; // User requested primary color

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      <View style={[styles.tabBarWrapper, { backgroundColor: tabBarBackground }]}>
        {/* Sliding Indicator */}
        <Animated.View
          style={[
            styles.indicator,
            indicatorStyle,
            { backgroundColor: indicatorColor },
          ]}
        />

        {/* Tab Items */}
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
              } else if (isFocused && route.name === 'index' && onHomeDoubleTap) {
                // Trigger refresh when tapping home tab while already on home
                onHomeDoubleTap();
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            return (
              <TabItem
                key={route.key}
                routeName={route.name}
                isFocused={isFocused}
                onPress={onPress}
                onLongPress={onLongPress}
                label={label}
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
    paddingHorizontal: TAB_BAR_MARGIN,
    backgroundColor: 'transparent',
    alignItems: 'center',
    width: '100%',
  },
  tabBarWrapper: {
    width: TAB_BAR_WIDTH,
    height: TAB_BAR_HEIGHT,
    borderRadius: TAB_BAR_HEIGHT / 2, // Full pill shape
    overflow: 'hidden',
    position: 'relative',
    // Strong shadow for floating effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  indicator: {
    position: 'absolute',
    width: INDICATOR_SIZE,
    height: INDICATOR_SIZE,
    borderRadius: INDICATOR_SIZE / 2, // Circular
    top: (TAB_BAR_HEIGHT - INDICATOR_SIZE) / 2,
    left: 0,
    // Add internal shadow/gradient effect if needed, but flat is cleaner often
  },
  tabBarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: TAB_BAR_HEIGHT,
  },
});
