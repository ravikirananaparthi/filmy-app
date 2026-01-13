import type { Image } from '@/src/types/image.types';
import { MasonryImageGrid } from '@components/common/MasonryImageGrid';
import { ShimmerProfileHero } from '@components/common/ShimmerPlaceholder';
import { Theme } from '@constants/theme';
import { useFavlistStore } from '@store/slices/favlistSlice';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Dimensions,
    InteractionManager,
    ScrollView,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import { MotionifyProvider, useMotionify } from 'react-native-motionify';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useDerivedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AnimatedProfileHeader, { HEADER_HEIGHT } from './components/AnimatedProfileHeader';
import FilterTabs from './components/FilterTabs';
import ProfileHero, { HERO_HEIGHT } from './components/ProfileHero';
import type { SortOption } from './hooks/useActressProfile';
import { useActressProfile } from './hooks/useActressProfile';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Filter tabs height for calculations
const FILTER_TABS_HEIGHT = 52;

// Per-tab content component to handle its own data
interface TabContentProps {
    actressId: string;
    sortBy: SortOption;
    isActive: boolean;
    onImagePress: (id: string) => void;
    onScroll?: any;
    insets: { bottom: number };
}

function TabContent({ actressId, sortBy, isActive, onImagePress, onScroll, insets }: TabContentProps) {
    // Track if this tab has ever been active (for keeping data after switching away)
    const [hasBeenActive, setHasBeenActive] = React.useState(false);

    React.useEffect(() => {
        if (isActive && !hasBeenActive) {
            setHasBeenActive(true);
        }
    }, [isActive, hasBeenActive]);

    const {
        data,
        isLoading,
        isRefetching,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        refetch,
    } = useActressProfile(actressId, {
        sortBy,
        // Only fetch when tab is/was active
        enabled: isActive || hasBeenActive,
    });

    const allImages = useMemo(() => {
        if (!data?.pages) return [];
        return data.pages.flatMap((page) => page.actress?.images || []) as Image[];
    }, [data?.pages]);

    const handleEndReached = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const handleLike = useCallback((imageId: string) => {
        console.log('Like image:', imageId);
    }, []);

    return (
        <View style={styles.tabContent}>
            <MasonryImageGrid
                data={allImages}
                onLike={handleLike}
                onImagePress={onImagePress}
                isLoading={isLoading && allImages.length === 0}
                isRefreshing={isRefetching}
                onRefresh={refetch}
                onEndReached={handleEndReached}
                onScroll={onScroll}
                contentContainerStyle={{ paddingBottom: insets.bottom + Theme.spacing.xxl }}
                hideLikeButton={true}
            />
        </View>
    );
}


// Inner component that uses motionify hooks
function ActressProfileContent() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // Tab state
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const pagerRef = useRef<ScrollView>(null);

    // Defer data loading until navigation animation completes
    const [isReady, setIsReady] = useState(false);

    React.useEffect(() => {
        const handle = InteractionManager.runAfterInteractions(() => {
            setIsReady(true);
        });
        return () => handle.cancel();
    }, []);

    // Scroll-driven animations via motionify
    const { onScroll, scrollY } = useMotionify();

    // Get actress info from first tab's data (defer until ready)
    const { data } = useActressProfile(id || '', { sortBy: 'popularity', enabled: isReady });
    const actress = data?.pages[0]?.actress;

    // Initialize favlist store with actress is_followed state
    const initFavlistFromApiData = useFavlistStore((state) => state.initFromApiData);

    useEffect(() => {
        if (actress) {
            initFavlistFromApiData([{ id: actress.id, is_followed: actress.is_followed }]);
        }
    }, [actress, initFavlistFromApiData]);

    // Calculate when to show sticky tabs (when hero + tabs scroll out)
    const stickyThreshold = HERO_HEIGHT - HEADER_HEIGHT - insets.top;

    // Derived value for whether tabs should be sticky
    const shouldShowStickyTabs = useDerivedValue(() => {
        return scrollY.value >= stickyThreshold;
    });

    // Animated style for sticky tabs container
    const stickyTabsStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [stickyThreshold - 20, stickyThreshold],
            [0, 1],
            'clamp'
        );
        const translateY = interpolate(
            scrollY.value,
            [stickyThreshold - 20, stickyThreshold],
            [-10, 0],
            'clamp'
        );
        return {
            opacity,
            transform: [{ translateY }],
        };
    });

    // Tab press handler - scroll pager to tab
    const handleTabPress = useCallback((index: number) => {
        setActiveTabIndex(index);
        pagerRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
    }, []);

    // Pager scroll handler
    const handlePagerScroll = useCallback((event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(offsetX / SCREEN_WIDTH);
        if (newIndex !== activeTabIndex && newIndex >= 0 && newIndex <= 2) {
            setActiveTabIndex(newIndex);
        }
    }, [activeTabIndex]);

    const handleImagePress = useCallback((imageId: string) => {
        // Pass actressId to image detail so it uses actress images, not home feed
        router.push(`/image/${imageId}?actressId=${id}`);
    }, [router, id]);

    const totalHeaderHeight = HEADER_HEIGHT + insets.top;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Hide default header */}
            <Stack.Screen options={{ headerShown: false }} />

            {/* Custom Animated Header */}
            <AnimatedProfileHeader
                actressId={id || ''}
                actressName={actress?.name || ''}
                coverImageUrl={actress?.cover_image_url || ''}
                scrollY={scrollY}
                heroHeight={HERO_HEIGHT}
            />

            {/* Sticky Filter Tabs - Fixed below header */}
            <Animated.View
                style={[
                    styles.stickyTabsContainer,
                    { top: totalHeaderHeight },
                    stickyTabsStyle
                ]}
                pointerEvents="box-none"
            >
                <FilterTabs
                    activeIndex={activeTabIndex}
                    onTabPress={handleTabPress}
                />
            </Animated.View>

            {/* Main content */}
            <ScrollView
                style={styles.mainScroll}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
                onScroll={onScroll}
                scrollEventThrottle={16}
            >
                {/* Hero Section */}
                {actress ? (
                    <ProfileHero
                        actressId={actress.id}
                        name={actress.name}
                        coverImageUrl={actress.cover_image_url}
                        scrollY={scrollY}
                    />
                ) : (
                    <ShimmerProfileHero />
                )}

                {/* Inline Filter Tabs (scrolls with content, hidden when sticky appears) */}
                <FilterTabs
                    activeIndex={activeTabIndex}
                    onTabPress={handleTabPress}
                />

                {/* Horizontal Pager for Tab Contents */}
                <ScrollView
                    ref={pagerRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={handlePagerScroll}
                    scrollEventThrottle={16}
                    style={styles.pager}
                >
                    {/* Popular Tab - lazy mount after navigation */}
                    {isReady ? (
                        <TabContent
                            actressId={id || ''}
                            sortBy="popularity"
                            isActive={activeTabIndex === 0}
                            onImagePress={handleImagePress}
                            insets={insets}
                        />
                    ) : (
                        <View style={styles.tabContent} />
                    )}

                    {/* Recent Tab - lazy mount after navigation */}
                    {isReady ? (
                        <TabContent
                            actressId={id || ''}
                            sortBy="recent"
                            isActive={activeTabIndex === 1}
                            onImagePress={handleImagePress}
                            insets={insets}
                        />
                    ) : (
                        <View style={styles.tabContent} />
                    )}

                    {/* Hottest Tab - lazy mount after navigation */}
                    {isReady ? (
                        <TabContent
                            actressId={id || ''}
                            sortBy="hotness"
                            isActive={activeTabIndex === 2}
                            onImagePress={handleImagePress}
                            insets={insets}
                        />
                    ) : (
                        <View style={styles.tabContent} />
                    )}
                </ScrollView>
            </ScrollView>
        </View>
    );
}

// Main component wrapped with MotionifyProvider
export default function ActressProfileScreen() {
    return (
        <MotionifyProvider>
            <ActressProfileContent />
        </MotionifyProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background.dark,
    },
    mainScroll: {
        flex: 1,
    },
    stickyTabsContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 99,
    },
    pager: {
        flex: 1,
    },
    tabContent: {
        width: SCREEN_WIDTH,
        minHeight: 500, // Minimum height for tab content
    },
});

