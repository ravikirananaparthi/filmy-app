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
import React, { memo, useCallback, useEffect } from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Animated, {
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

// Icon map for non-upload tabs
const TAB_ICONS: Record<string, { filled: React.FC<any>; unfilled: React.FC<any> }> = {
  index:     { filled: HomeIcon,      unfilled: HomeIconUF },
  search:    { filled: SearchIcon,    unfilled: SearchIconUF },
  favorites: { filled: FavoritesIcon, unfilled: FavoritesIconUF },
  menu:      { filled: MenuIcon,      unfilled: MenuIconUF },
};

// Routes that should NOT move the indicator
const UPLOAD_ROUTE = 'upload';

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

  // ── Upload center button ──────────────────────────────────────────────────
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

  // ── Regular tab item ──────────────────────────────────────────────────────
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

export function AnimatedTabBar({ state, descriptors, navigation, onHomeDoubleTap, onUploadPress }: AnimatedTabBarProps) {
  const insets = useSafeAreaInsets();

  // Exclude the upload route from indicator positioning
  const navigableTabs = state.routes.filter((r) => r.name !== UPLOAD_ROUTE);
  const focusedNavIndex = navigableTabs.findIndex(
    (r) => r.key === state.routes[state.index]?.key
  );
  const indicatorIndex = focusedNavIndex >= 0 ? focusedNavIndex : 0;

  // Spread indicator across only non-upload tabs
  const NAV_TAB_WIDTH = TAB_BAR_WIDTH / TAB_COUNT;
  // Upload tab is center (index 2), so for indicator we need to skip that slot
  // Layout: Home(0) Search(1) Upload(2) Favorites(3) Menu(4)
  // Indicator positions for navigable tabs: 0,1,3,4 positions (skip 2=upload)
  const getIndicatorX = (routeName: string): number => {
    const posMap: Record<string, number> = {
      index:     0,
      search:    1,
      upload:    2, // won't be used
      favorites: 3,
      menu:      4,
    };
    const pos = posMap[routeName] ?? 0;
    return pos * NAV_TAB_WIDTH + INDICATOR_PADDING;
  };

  const currentRoute = state.routes[state.index];
  const indicatorPosition = useSharedValue(getIndicatorX(currentRoute?.name ?? 'index'));

  useEffect(() => {
    if (currentRoute?.name !== UPLOAD_ROUTE) {
      indicatorPosition.value = withSpring(
        getIndicatorX(currentRoute?.name ?? 'index'),
        SPRING_CONFIG
      );
    }
  }, [state.index]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorPosition.value }],
  }));

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 24) }]}>
      <View style={[styles.tabBarWrapper, { backgroundColor: '#121212' }]}>
        {/* Sliding indicator (hidden behind upload button position) */}
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
              // Upload tab → open the sheet (no route push needed)
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
