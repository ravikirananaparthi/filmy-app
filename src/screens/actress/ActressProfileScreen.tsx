import type { Image } from '@/src/types/image.types';
import { MasonryImageGrid } from '@components/common/MasonryImageGrid';
import { Theme } from '@constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import { MotionifyProvider, useMotionify } from 'react-native-motionify';
import Animated, {
    interpolate,
    useAnimatedStyle
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FilterTabs from './components/FilterTabs';
import ProfileHero, { HERO_HEIGHT } from './components/ProfileHero';
import type { SortOption } from './hooks/useActressProfile';
import { useActressProfile } from './hooks/useActressProfile';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_HEIGHT = 56;

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
    const {
        data,
        isLoading,
        isRefetching,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        refetch,
    } = useActressProfile(actressId, { sortBy });

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

    // Only render when active or has cached data
    if (!isActive && allImages.length === 0) {
        return null;
    }

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

    // Scroll-driven animations via motionify
    const { onScroll, scrollY } = useMotionify();

    // Get actress info from first tab's data
    const { data } = useActressProfile(id || '', { sortBy: 'popularity' });
    const actress = data?.pages[0]?.actress;
    const imageCount = actress?.image_count || 0;

    // Header animations
    const headerAnimatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [0, HERO_HEIGHT - HEADER_HEIGHT - insets.top],
            [0, 1],
            'clamp'
        );
        return { opacity };
    });

    const headerTitleAnimatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [HERO_HEIGHT * 0.6, HERO_HEIGHT - HEADER_HEIGHT],
            [0, 1],
            'clamp'
        );
        return { opacity };
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
        router.push(`/image/${imageId}`);
    }, [router]);

    const handleFavlistPress = useCallback(() => {
        console.log('Toggle favlist for actress:', id);
    }, [id]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Custom Header */}
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTitle: '',
                    headerLeft: () => (
                        <View style={styles.headerButton}>
                            <Ionicons
                                name="chevron-back"
                                size={28}
                                color="#FFFFFF"
                                onPress={() => router.back()}
                            />
                        </View>
                    ),
                    headerBackground: () => (
                        <Animated.View
                            style={[
                                styles.headerBackground,
                                { paddingTop: insets.top },
                                headerAnimatedStyle,
                            ]}
                        >
                            <Animated.Text
                                style={[styles.headerTitle, headerTitleAnimatedStyle]}
                                numberOfLines={1}
                            >
                                {actress?.name || ''}
                            </Animated.Text>
                        </Animated.View>
                    ),
                }}
            />

            {/* Main content with nested scroll */}
            <ScrollView
                style={styles.mainScroll}
                showsVerticalScrollIndicator={false}
                stickyHeaderIndices={[1]}
                nestedScrollEnabled
            >
                {/* Hero Section */}
                {actress && (
                    <ProfileHero
                        name={actress.name}
                        coverImageUrl={actress.cover_image_url}
                        imageCount={imageCount}
                        scrollY={scrollY}
                        isFavorite={actress.is_followed}
                        onFavlistPress={handleFavlistPress}
                    />
                )}

                {/* Sticky Filter Tabs */}
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
                    {/* Popular Tab */}
                    <TabContent
                        actressId={id || ''}
                        sortBy="popularity"
                        isActive={activeTabIndex === 0}
                        onImagePress={handleImagePress}
                        insets={insets}
                    />

                    {/* Recent Tab */}
                    <TabContent
                        actressId={id || ''}
                        sortBy="recent"
                        isActive={activeTabIndex === 1}
                        onImagePress={handleImagePress}
                        insets={insets}
                    />

                    {/* Hottest Tab */}
                    <TabContent
                        actressId={id || ''}
                        sortBy="hotness"
                        isActive={activeTabIndex === 2}
                        onImagePress={handleImagePress}
                        insets={insets}
                    />
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
    headerBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Theme.colors.background.dark,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: Theme.spacing.sm,
    },
    pager: {
        flex: 1,
    },
    tabContent: {
        width: SCREEN_WIDTH,
        minHeight: 500, // Minimum height for tab content
    },
});
