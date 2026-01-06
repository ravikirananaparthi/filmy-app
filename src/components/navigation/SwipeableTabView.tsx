import { useTabNavigation } from '@/src/contexts/TabNavigationContext';
import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import PagerView, {
    PagerViewOnPageScrollEvent,
    PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view';

interface SwipeableTabViewProps {
    children: React.ReactNode[];
    initialIndex?: number;
    onPageChange?: (index: number) => void;
}

/**
 * SwipeableTabView - Horizontal pager for tab screens.
 * Syncs scroll position with AnimatedTabBar for smooth indicator animation.
 */
export default function SwipeableTabView({
    children,
    initialIndex = 0,
    onPageChange,
}: SwipeableTabViewProps) {
    const pagerRef = useRef<PagerView>(null);
    const {
        currentIndex,
        scrollPosition,
        registerPagerRef,
        isSwipeActive,
    } = useTabNavigation();

    // Register pager ref for programmatic navigation from tabs
    useEffect(() => {
        registerPagerRef(pagerRef as React.RefObject<PagerView>);
    }, [registerPagerRef]);

    // Handle page scroll for smooth indicator animation
    const handlePageScroll = useCallback((event: PagerViewOnPageScrollEvent) => {
        'worklet';
        const { position, offset } = event.nativeEvent;
        // scrollPosition = position + offset (e.g., 1.5 = halfway between page 1 and 2)
        scrollPosition.value = position + offset;
    }, [scrollPosition]);

    // Handle page selection (when swipe completes)
    const handlePageSelected = useCallback((event: PagerViewOnPageSelectedEvent) => {
        const { position } = event.nativeEvent;
        currentIndex.value = position;
        isSwipeActive.value = false;
        onPageChange?.(position);
    }, [currentIndex, isSwipeActive, onPageChange]);

    // Handle scroll state change (detect swipe start/end)
    const handlePageScrollStateChanged = useCallback((state: string) => {
        // 'idle' | 'dragging' | 'settling'
        if (state === 'dragging') {
            isSwipeActive.value = true;
        } else if (state === 'idle') {
            isSwipeActive.value = false;
        }
    }, [isSwipeActive]);

    return (
        <PagerView
            ref={pagerRef}
            style={styles.pager}
            initialPage={initialIndex}
            onPageScroll={handlePageScroll}
            onPageSelected={handlePageSelected}
            onPageScrollStateChanged={(e) => handlePageScrollStateChanged(e.nativeEvent.pageScrollState)}
            overdrag={false}
            offscreenPageLimit={1} // Keep adjacent pages rendered for smooth swipes
        >
            {React.Children.map(children, (child, index) => (
                <View key={index} style={styles.page}>
                    {child}
                </View>
            ))}
        </PagerView>
    );
}

const styles = StyleSheet.create({
    pager: {
        flex: 1,
    },
    page: {
        flex: 1,
        backgroundColor: '#000000', // Dark background for all tabs
    },
});
