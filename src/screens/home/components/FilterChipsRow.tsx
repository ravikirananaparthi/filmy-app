import { Text } from '@/src/components/ui';
import { Theme } from '@constants/theme';
import * as Haptics from 'expo-haptics';
import { ChevronDown } from 'lucide-react-native';
import React from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    View,
    useColorScheme,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Tag {
    id: string;
    name: string;
    usage_count?: number;
}

interface FilterChipsRowProps {
    selectedTags: string[];
    onFilterPress: () => void;
    onSortPress: () => void;
    onTagToggle: (tagName: string) => void;
    popularTags: Tag[];
    sortLabel?: string;
}

export const FilterChipsRow: React.FC<FilterChipsRowProps> = ({
    selectedTags,
    onFilterPress,
    onSortPress,
    onTagToggle,
    popularTags,
    sortLabel = 'Popular',
}) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const chipBackground = isDark
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.05)';

    const chipActiveBackground = Theme.colors.primary.main;

    const chipTextColor = isDark
        ? Theme.colors.text.primary
        : Theme.colors.textLight.primary;

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Filters Chip */}
                <FilterChip
                    label="Filters"
                    hasDropdown
                    onPress={onFilterPress}
                    backgroundColor={chipBackground}
                    textColor={chipTextColor}
                    isActive={selectedTags.length > 0}
                    activeBackground={chipActiveBackground}
                />

                {/* Sort Chip */}
                <FilterChip
                    label={`Sort: ${sortLabel}`}
                    hasDropdown
                    onPress={onSortPress}
                    backgroundColor={chipBackground}
                    textColor={chipTextColor}
                />

                {/* Divider */}
                <View style={[styles.divider, { backgroundColor: chipBackground }]} />

                {/* Tag Chips */}
                {popularTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag.name);
                    return (
                        <FilterChip
                            key={tag.id}
                            label={tag.name}
                            onPress={() => onTagToggle(tag.name)}
                            backgroundColor={chipBackground}
                            textColor={chipTextColor}
                            isActive={isSelected}
                            activeBackground={chipActiveBackground}
                        />
                    );
                })}
            </ScrollView>
        </View>
    );
};

interface FilterChipProps {
    label: string;
    hasDropdown?: boolean;
    onPress: () => void;
    backgroundColor: string;
    textColor: string;
    isActive?: boolean;
    activeBackground?: string;
}

const FilterChip: React.FC<FilterChipProps> = ({
    label,
    hasDropdown = false,
    onPress,
    backgroundColor,
    textColor,
    isActive = false,
    activeBackground,
}) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.95, { damping: 15, stiffness: 350 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    };

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
    };

    const chipBg = isActive ? activeBackground : backgroundColor;
    const chipText = isActive ? '#FFFFFF' : textColor;

    return (
        <AnimatedPressable
            style={[styles.chip, { backgroundColor: chipBg }, animatedStyle]}
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <Text weight="semibold" style={[styles.chipText, { color: chipText }]}>{label}</Text>
            {hasDropdown && (
                <ChevronDown size={14} color={chipText} strokeWidth={2.5} />
            )}
        </AnimatedPressable>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 14,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: Theme.radius.full,
        gap: 4,
    },
    chipText: {
        fontSize: 13,
    },
    divider: {
        width: 1,
        height: 20,
        marginHorizontal: 4,
        opacity: 0.5,
    },
});

export default FilterChipsRow;
