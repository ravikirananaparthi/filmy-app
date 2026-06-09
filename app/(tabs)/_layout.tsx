import { RefreshProvider, useRefreshContext } from '@/src/contexts/RefreshContext';
import { AnimatedTabBar } from '@components/ui/animated-tab-bar';
import { useUploadStore } from '@store/slices/uploadSlice';
import { Tabs, router } from 'expo-router';
import React, { useCallback } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { MotionifyProvider, MotionifyView } from 'react-native-motionify';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// iOS-only tuning: the pill + iPhone safe-area is taller than the
// previous 80px slide, so the bar peeked. We compute the slide from the bar
// height + safe area + buffer. Android worked fine with the original 80.
const TAB_BAR_HEIGHT = 56;
const HIDE_BUFFER = 24;
const ANDROID_HIDE_DISTANCE = 80;

// ─── Main layout ─────────────────────────────────────────────────────────────
function TabLayoutContent() {
  const { triggerRefresh } = useRefreshContext();
  const reset = useUploadStore((s) => s.reset);
  const insets = useSafeAreaInsets();

  const handleUploadPress = useCallback(() => {
    reset();
    router.push('/upload/pick' as any);
  }, [reset]);

  // Distance to translate the bar so it ends fully below the screen edge.
  // iOS: compute from actual safe area; Android: keep prior working value.
  const hideDistance =
    Platform.OS === 'ios'
      ? TAB_BAR_HEIGHT + Math.max(insets.bottom, 17) + HIDE_BUFFER
      : ANDROID_HIDE_DISTANCE;

  return (
    <View style={styles.container}>
      <Tabs
        backBehavior="history"
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.hiddenTabBar,
          lazy: true,
          freezeOnBlur: true,
        }}
        tabBar={(props) => (
          <MotionifyView
            animatedY
            hideOn="down"
            translateRange={{ from: 0, to: hideDistance }}
            animationDuration={150}
            style={styles.tabBarMotionify}
          >
            <AnimatedTabBar
              {...props}
              onHomeDoubleTap={triggerRefresh}
              onUploadPress={handleUploadPress}
            />
          </MotionifyView>
        )}
      >
        <Tabs.Screen name="index"     options={{ title: 'Home' }} />
        <Tabs.Screen name="search"    options={{ title: 'Explore' }} />
        <Tabs.Screen name="upload"    options={{ title: 'Upload' }} />
        <Tabs.Screen name="favorites" options={{ title: 'Favorites' }} />
        <Tabs.Screen name="menu"      options={{ title: 'Profile' }} />
      </Tabs>
    </View>
  );
}

export default function TabLayout() {
  return (
    <RefreshProvider>
      <MotionifyProvider threshold={10} supportIdle={false}>
        <TabLayoutContent />
      </MotionifyProvider>
    </RefreshProvider>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  hiddenTabBar: { display: 'none' },
  tabBarMotionify: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
});
