import { AnimatedTabBar } from '@/components/ui/animated-tab-bar';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MotionifyProvider, MotionifyView } from 'react-native-motionify';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function TabLayoutContent() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.hiddenTabBar,
        }}
        tabBar={(props) => (
          <MotionifyView
            animatedY
            hideOn="down"
            translateRange={{ from: 0, to: 80 }}
            animationDuration={150}
            style={styles.tabBarMotionify}
          >
            <AnimatedTabBar {...props} />
          </MotionifyView>
        )}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
          }}
        />
        <Tabs.Screen
          name="trending"
          options={{
            title: 'Trending',
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: 'Favorites',
          }}
        />
        <Tabs.Screen
          name="menu"
          options={{
            title: 'Menu',
          }}
        />
      </Tabs>
    </View>
  );
}

export default function TabLayout() {
  return (
    <MotionifyProvider threshold={10} supportIdle={false}>
      <TabLayoutContent />
    </MotionifyProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
});
