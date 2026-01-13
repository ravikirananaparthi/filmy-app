import { Text } from '@components/ui/Text';
import { Theme, Typography } from '@constants/theme';
import React from 'react';
import {
    Dimensions,
    Pressable,
    StyleSheet,
    View,
} from 'react-native';
import Animated, {
    SharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type SortOption = 'popularity' | 'recent' | 'hotness';

interface FilterTab {
    key: SortOption;
    label: string;
}

const TABS: FilterTab[] = [
    { key: 'popularity', label: 'Popular' },
    { key: 'recent', label: 'Recent' },
    { key: 'hotness', label: 'Hottest' },
];

const TAB_WIDTH = SCREEN_WIDTH / 3;

// Spring config for snappy indicator movement
const SPRING_CONFIG = {
    damping: 20,
    stiffness: 300,
    mass: 0.8,
};

interface FilterTabsProps {
    activeIndex: number;
    onTabPress: (index: number) => void;
    scrollX?: SharedValue<number>; // For syncing with pager scroll
}

export default function FilterTabs({
    activeIndex,
    onTabPress,
    scrollX,
}: FilterTabsProps) {
    // Animated indicator style - follows scroll or snaps to activeIndex
    const indicatorStyle = useAnimatedStyle(() => {
        if (scrollX) {
            // Sync with pager scroll
            const translateX = scrollX.value;
            return {
                transform: [{ translateX }],
            };
        }
        // Snap to active tab with spring animation
        return {
            transform: [{ translateX: withSpring(activeIndex * TAB_WIDTH, SPRING_CONFIG) }],
        };
    });

    return (
        <View style={styles.container}>
            <View style={styles.tabsRow}>
                {TABS.map((tab, index) => {
                    const isActive = activeIndex === index;
                    return (
                        <Pressable
                            key={tab.key}
                            onPress={() => onTabPress(index)}
                            style={styles.tab}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    isActive && styles.tabTextActive,
                                ]}
                            >
                                {tab.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            {/* Animated Indicator - no border, just underline */}
            <Animated.View style={[styles.indicator, indicatorStyle]} />
        </View>
    );
}

// Helper to get sort option from index
export function getSortOptionFromIndex(index: number): SortOption {
    return TABS[index]?.key || 'popularity';
}

// Helper to get index from sort option
export function getIndexFromSortOption(sortOption: SortOption): number {
    return TABS.findIndex(tab => tab.key === sortOption);
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Theme.colors.background.dark,
        paddingTop: Theme.spacing.sm,
    },
    tabsRow: {
        flexDirection: 'row',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: Theme.spacing.md,
    },
    tabText: {
        ...Typography.bodySmall,
        color: Theme.colors.text.secondary,
        fontWeight: '500',
    },
    tabTextActive: {
        color: Theme.palette.primary,
        fontWeight: '600',
    },
    indicator: {
        position: 'absolute',
        bottom: 0,
        width: TAB_WIDTH * 0.5,
        marginLeft: TAB_WIDTH * 0.25,
        height: 3,
        backgroundColor: Theme.palette.primary,
        borderRadius: 2,
    },
});
