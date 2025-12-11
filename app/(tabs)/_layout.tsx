import { AnimatedTabBar } from '@/components/ui/animated-tab-bar';
import { Theme } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MotionifyProvider, MotionifyView } from 'react-native-motionify';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function TabLayoutContent() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colorScheme === 'dark' ? Theme.palette.primaryLight : Theme.palette.primary,
          headerShown: false,
          tabBarStyle: styles.hiddenTabBar,
        }}
        tabBar={(props) => (
          // Use MotionifyView instead of MotionifyBottomTab for transparent background
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
            tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="trending"
          options={{
            title: 'Trending',
            tabBarIcon: ({ color, size }) => <Ionicons name="trending-up" color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color, size }) => <Ionicons name="search" color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: 'Favorites',
            tabBarIcon: ({ color, size }) => <Ionicons name="heart" color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="menu"
          options={{
            title: 'Menu',
            tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
          }}
        />
      </Tabs>

      {/* Floating Action Button - fades and scales down when scrolling */}
      {/* <MotionifyView
        animatedY
        fadeScale
        hideOn="down"
        translateRange={{ from: 0, to: 60 }}
        animationDuration={400}
        style={[styles.fabContainer, { bottom: 100 + insets.bottom }]}
      >
        <FloatingActionButton />
      </MotionifyView> */}
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
  fabContainer: {
    position: 'absolute',
    right: 20,
    zIndex: 100,
  },
});
