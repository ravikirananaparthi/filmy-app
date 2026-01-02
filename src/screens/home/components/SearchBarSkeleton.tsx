import { Text } from '@/src/components/ui';
import { Theme } from '@constants/theme';
import * as Haptics from 'expo-haptics';
import { Search } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, useColorScheme } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SearchBarSkeletonProps {
    onPress?: () => void;
}

export const SearchBarSkeleton: React.FC<SearchBarSkeletonProps> = ({
    onPress,
}) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    };

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.();
    };

    const backgroundColor = isDark
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.05)';

    const textColor = isDark
        ? Theme.colors.text.secondary
        : Theme.colors.textLight.secondary;

    const iconColor = isDark
        ? Theme.colors.text.tertiary
        : Theme.colors.textLight.tertiary;

    return (
        <AnimatedPressable
            style={[styles.searchBar, { backgroundColor }, animatedStyle]}
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Search"
            accessibilityHint="Open search to find actresses or tags"
            accessibilityState={{ disabled: false }}
        >
            <Search size={18} color={iconColor} strokeWidth={2.5} />
            <Text style={[styles.placeholder, { color: textColor }]}>
                Search actresses, tags...
            </Text>
        </AnimatedPressable>
    );
};

const styles = StyleSheet.create({
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: Theme.radius.xxl,
        gap: 10,
    },
    placeholder: {
        fontSize: 15,
    },
});

export default SearchBarSkeleton;
