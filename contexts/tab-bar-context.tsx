import React, { createContext, ReactNode, useContext } from 'react';
import { SharedValue, useSharedValue } from 'react-native-reanimated';

interface TabBarContextType {
  scrollY: SharedValue<number>;
  isTabBarVisible: SharedValue<number>;
}

const TabBarContext = createContext<TabBarContextType | null>(null);

interface TabBarProviderProps {
  children: ReactNode;
}

export function TabBarProvider({ children }: TabBarProviderProps) {
  const scrollY = useSharedValue(0);
  const isTabBarVisible = useSharedValue(1);

  return (
    <TabBarContext.Provider value={{ scrollY, isTabBarVisible }}>
      {children}
    </TabBarContext.Provider>
  );
}

export function useTabBar() {
  const context = useContext(TabBarContext);
  if (!context) {
    throw new Error('useTabBar must be used within a TabBarProvider');
  }
  return context;
}
