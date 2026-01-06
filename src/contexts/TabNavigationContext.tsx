import React, { createContext, useCallback, useContext, useRef } from 'react';
import type PagerView from 'react-native-pager-view';
import { SharedValue, useSharedValue, withSpring } from 'react-native-reanimated';

interface TabNavigationContextValue {
    // Current page index (0-based)
    currentIndex: SharedValue<number>;
    // Scroll position for smooth indicator animation (e.g., 1.5 = halfway between tab 1 and 2)
    scrollPosition: SharedValue<number>;
    // Number of tabs
    tabCount: number;
    // Navigate to a specific tab programmatically
    navigateToTab: (index: number) => void;
    // Register the PagerView instance for programmatic navigation
    registerPager: (pager: PagerView | null) => void;
    // Whether the user is currently swiping (vs tapping)
    isSwipeActive: SharedValue<boolean>;
}

const TabNavigationContext = createContext<TabNavigationContextValue | null>(null);

interface TabNavigationProviderProps {
    children: React.ReactNode;
    tabCount: number;
    initialIndex?: number;
    onTabChange?: (index: number) => void;
}

// Spring config for smooth tab press animation
const SPRING_CONFIG = {
    damping: 20,
    stiffness: 200,
    mass: 0.5,
};

/**
 * Provider for swipeable tab navigation state.
 * Shares scroll position and current index between PagerView and AnimatedTabBar.
 */
export function TabNavigationProvider({
    children,
    tabCount,
    initialIndex = 0,
    onTabChange,
}: TabNavigationProviderProps) {
    const currentIndex = useSharedValue(initialIndex);
    const scrollPosition = useSharedValue(initialIndex);
    const isSwipeActive = useSharedValue(false);
    const pagerInstance = useRef<PagerView | null>(null);

    const registerPager = useCallback((pager: PagerView | null) => {
        pagerInstance.current = pager;
    }, []);

    const navigateToTab = useCallback((index: number) => {
        if (index >= 0 && index < tabCount && pagerInstance.current) {
            // Animate to page using PagerView
            pagerInstance.current.setPage(index);
            // Also animate scrollPosition with spring for smoother indicator
            scrollPosition.value = withSpring(index, SPRING_CONFIG);
            currentIndex.value = index;
            onTabChange?.(index);
        }
    }, [tabCount, onTabChange, scrollPosition, currentIndex]);

    return (
        <TabNavigationContext.Provider
            value={{
                currentIndex,
                scrollPosition,
                tabCount,
                navigateToTab,
                registerPager,
                isSwipeActive,
            }}
        >
            {children}
        </TabNavigationContext.Provider>
    );
}

/**
 * Hook to access tab navigation context.
 * Must be used within a TabNavigationProvider.
 */
export function useTabNavigation() {
    const context = useContext(TabNavigationContext);
    if (!context) {
        throw new Error('useTabNavigation must be used within a TabNavigationProvider');
    }
    return context;
}

export default TabNavigationContext;

