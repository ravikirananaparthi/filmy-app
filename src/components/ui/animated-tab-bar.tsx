import {
  FavoritesIcon,
  FavoritesIconUF,
  HomeIcon,
  HomeIconUF,
  MenuIcon,
  MenuIconUF,
  SearchIcon,
  SearchIconUF,
  UploadIcon,
} from '@/components/icons/tab-bar';
import { Theme } from '@/constants/theme';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import React, { memo, useCallback, useEffect, useRef } from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_BAR_MARGIN = 20;
const TAB_BAR_HEIGHT = 62;
const TAB_COUNT = 5;
const TAB_BAR_WIDTH = SCREEN_WIDTH - TAB_BAR_MARGIN * 2;
const TAB_ITEM_WIDTH = TAB_BAR_WIDTH / TAB_COUNT;
const INDICATOR_SIZE = 50;
const INDICATOR_PADDING = (TAB_ITEM_WIDTH - INDICATOR_SIZE) / 2;
const UPLOAD_SIZE = 46;

const SPRING_CONFIG = {
  damping: 25,
  stiffness: 250,
  mass: 0.8,
};

const UPLOAD_ROUTE = 'upload';

// ─── Stable position map (module-level, never recreated) ─────────────────────
// Physical slot positions: Home=0 Search=1 Upload=2 Favorites=3 Menu=4
const ROUTE_SLOT: Record<string, number> = {
  index: 0,
  search: 1,
  favorites: 3,
  menu: 4,
};

/**
 * Returns the indicator's translateX for a given route name.
 * Returns null for upload or any unknown route — callers must treat null as
 * "do not move the indicator".
 */
function getIndicatorX(routeName: string): number | null {
  const slot = ROUTE_SLOT[routeName];
  if (slot === undefined) return null;
  return slot * TAB_ITEM_WIDTH + INDICATOR_PADDING;
}

// Icon map for non-upload tabs
const TAB_ICONS: Record<string, { filled: React.FC<any>; unfilled: React.FC<any> }> = {
  index: { filled: HomeIcon, unfilled: HomeIconUF },
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
  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  if (routeName === UPLOAD_ROUTE) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Upload"
        onPress={handlePress}
        onLongPress={onLongPress}
        style={styles.uploadTabItem}
      >
        <View style={styles.uploadCircle}>
          <UploadIcon size={20} color="#fff" strokeWidth={2.8} />
        </View>
      </Pressable>
    );
  }

  const iconConfig = TAB_ICONS[routeName];
  if (!iconConfig) return null;
  const IconComponent = isFocused ? iconConfig.filled : iconConfig.unfilled;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={label}
      onPress={handlePress}
      onLongPress={onLongPress}
      style={styles.tabItem}
    >
      <IconComponent size={24} color="#FFFFFF" />
    </Pressable>
  );
});

interface AnimatedTabBarProps extends BottomTabBarProps {
  onHomeDoubleTap?: () => void;
  onUploadPress?: () => void;
}

export function AnimatedTabBar({
  state,
  descriptors,
  navigation,
  onHomeDoubleTap,
  onUploadPress,
}: AnimatedTabBarProps) {
  const insets = useSafeAreaInsets();

  // The focused route name — the ONLY thing that should drive indicator position.
  // We deliberately use the name string (not the numeric index) as the signal so
  // that transient index fluctuations during React Navigation transitions don't
  // trigger spurious indicator animations.
  const focusedRouteName = state.routes[state.index]?.name ?? '';

  // Remember the last route that produced a valid indicator position.
  // This prevents the indicator from snapping to home (the ?? fallback) during
  // brief moments where focusedRouteName is upload or undefined.
  const lastValidX = useRef<number>(getIndicatorX('index') ?? 0);

  // Derive the target X for the current route.
  const targetX = getIndicatorX(focusedRouteName); // null when upload / unknown

  // Initialise the shared value at the correct position without any animation.
  const indicatorPosition = useSharedValue(
    targetX !== null ? targetX : lastValidX.current
  );

  useEffect(() => {
    // If this render's route has no valid position (upload tab, unknown route,
    // or any transient state.index glitch), do nothing — keep the indicator
    // exactly where it was.
    if (targetX === null) return;

    // Only animate when the destination actually changes.
    if (targetX === lastValidX.current) return;

    lastValidX.current = targetX;
    cancelAnimation(indicatorPosition);
    indicatorPosition.value = withSpring(targetX, SPRING_CONFIG);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedRouteName]); // ← route NAME, not numeric index

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorPosition.value }],
  }));

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom - 10, 8) }]}>
      <View style={[styles.tabBarWrapper, { backgroundColor: '#121212' }]}>
        <Animated.View
          style={[
            styles.indicator,
            indicatorStyle,
            { backgroundColor: Theme.palette.primary },
          ]}
        />

        <View style={styles.tabBarContent}>
          {state.routes.map((route) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? String(options.tabBarLabel)
                : options.title ?? route.name;
            const isFocused = state.index === state.routes.indexOf(route);

            const onPress = () => {
              if (route.name === UPLOAD_ROUTE) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                onUploadPress?.();
                return;
              }
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
              navigation.emit({ type: 'tabLongPress', target: route.key });
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
    borderRadius: TAB_BAR_HEIGHT / 2,
    overflow: 'hidden',
    position: 'relative',
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
    borderRadius: INDICATOR_SIZE / 2,
    top: (TAB_BAR_HEIGHT - INDICATOR_SIZE) / 2,
    left: 0,
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
  uploadTabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: TAB_BAR_HEIGHT,
  },
  uploadCircle: {
    width: UPLOAD_SIZE,
    height: UPLOAD_SIZE,
    borderRadius: UPLOAD_SIZE / 2,
    backgroundColor: Theme.palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Theme.palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
});
