import { RefreshProvider, useRefreshContext } from '@/src/contexts/RefreshContext';
import { TabNavigationProvider, useTabNavigation } from '@/src/contexts/TabNavigationContext';
import { AnimatedTabBar } from '@components/ui/animated-tab-bar';
import { Tabs, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { MotionifyProvider, MotionifyView } from 'react-native-motionify';
import PagerView, { PagerViewOnPageScrollEvent, PagerViewOnPageSelectedEvent } from 'react-native-pager-view';

// Import actual screen components for PagerView rendering
import FavoritesScreen from '@screens/favorites/FavoritesScreen';
import HomeScreen from '@screens/home/HomeScreen';
import MenuScreen from '@screens/menu/MenuScreen';
import SearchScreen from '@screens/search/SearchScreen';
import TrendingScreen from '@screens/trending/TrendingScreen';

const TAB_COUNT = 5;
const TAB_ROUTES = ['index', 'trending', 'search', 'favorites', 'menu'] as const;

function TabLayoutContent() {
  const { triggerRefresh } = useRefreshContext();
  const { scrollPosition, currentIndex, isSwipeActive, registerPager } = useTabNavigation();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  // Callback ref to register PagerView instance
  const handlePagerRef = useCallback((pager: PagerView | null) => {
    registerPager(pager);
    if (pager) {
      setIsInitialized(true);
    }
  }, [registerPager]);

  // Handle page scroll for smooth indicator animation
  const handlePageScroll = useCallback((event: PagerViewOnPageScrollEvent) => {
    const { position, offset } = event.nativeEvent;
    scrollPosition.value = position + offset;
  }, [scrollPosition]);

  // Handle page selection (when swipe completes)
  const handlePageSelected = useCallback((event: PagerViewOnPageSelectedEvent) => {
    const { position } = event.nativeEvent;
    currentIndex.value = position;
    isSwipeActive.value = false;
    // Snap scrollPosition to final position to prevent stuck indicator
    scrollPosition.value = position;

    // Sync with expo-router (without navigation animation since we're swiping)
    const routeName = TAB_ROUTES[position];
    router.replace(`/(tabs)/${routeName === 'index' ? '' : routeName}` as any);
  }, [currentIndex, isSwipeActive, scrollPosition, router]);

  // Handle scroll state change (detect swipe start/end)
  const handlePageScrollStateChanged = useCallback((state: string) => {
    if (state === 'dragging') {
      isSwipeActive.value = true;
    } else if (state === 'idle') {
      isSwipeActive.value = false;
      // Ensure scrollPosition is snapped to current index when idle
      scrollPosition.value = currentIndex.value;
    }
  }, [isSwipeActive, scrollPosition, currentIndex]);

  return (
    <View style={styles.container}>
      {/* Hidden Tabs for routing state management */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.hiddenTabBar,
          lazy: false, // Render all screens since PagerView handles them
          freezeOnBlur: false,
        }}
        tabBar={(props) => (
          <MotionifyView
            animatedY
            hideOn="down"
            translateRange={{ from: 0, to: 80 }}
            animationDuration={150}
            style={styles.tabBarMotionify}
          >
            <AnimatedTabBar {...props} onHomeDoubleTap={triggerRefresh} />
          </MotionifyView>
        )}
      >
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="trending" options={{ title: 'Trending' }} />
        <Tabs.Screen name="search" options={{ title: 'Search' }} />
        <Tabs.Screen name="favorites" options={{ title: 'Favorites' }} />
        <Tabs.Screen name="menu" options={{ title: 'Menu' }} />
      </Tabs>

      {/* PagerView overlay for swipe navigation */}
      <View style={styles.pagerContainer} pointerEvents={isInitialized ? 'auto' : 'none'}>
        <PagerView
          ref={handlePagerRef}
          style={styles.pager}
          initialPage={0}
          onPageScroll={handlePageScroll}
          onPageSelected={handlePageSelected}
          onPageScrollStateChanged={(e) => handlePageScrollStateChanged(e.nativeEvent.pageScrollState)}
          overdrag={false}
          offscreenPageLimit={1}
        >
          <View key="0" style={styles.page}>
            <HomeScreen />
          </View>
          <View key="1" style={styles.page}>
            <TrendingScreen />
          </View>
          <View key="2" style={styles.page}>
            <SearchScreen />
          </View>
          <View key="3" style={styles.page}>
            <FavoritesScreen />
          </View>
          <View key="4" style={styles.page}>
            <MenuScreen />
          </View>
        </PagerView>
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <RefreshProvider>
      <TabNavigationProvider tabCount={TAB_COUNT}>
        <MotionifyProvider threshold={10} supportIdle={false}>
          <TabLayoutContent />
        </MotionifyProvider>
      </TabNavigationProvider>
    </RefreshProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  hiddenTabBar: {
    display: 'none',
  },
  tabBarMotionify: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    zIndex: 100,
  },
  pagerContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
    backgroundColor: '#000000',
  },
});

