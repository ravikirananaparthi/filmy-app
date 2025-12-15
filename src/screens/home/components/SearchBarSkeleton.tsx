import { Theme } from '@constants/theme';
import * as Haptics from 'expo-haptics';
import { Blend, Search } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SearchBarSkeletonProps {
    onPress?: () => void;
    onBlendPress?: () => void;
}

export const SearchBarSkeleton: React.FC<SearchBarSkeletonProps> = ({
    onPress,
    onBlendPress,
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

    const handleBlendPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onBlendPress?.();
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
        <View style={styles.container}>
            <AnimatedPressable
                style={[styles.searchBar, { backgroundColor }, animatedStyle]}
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                <Search size={18} color={iconColor} strokeWidth={2.5} />
                <Text style={[styles.placeholder, { color: textColor }]}>
                    Search actresses, tags...
                </Text>
            </AnimatedPressable>

            <Pressable
                style={[styles.blendButton, { backgroundColor }]}
                onPress={handleBlendPress}
            >
                <Blend size={20} color={Theme.colors.primary.main} strokeWidth={2} />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 16,
        marginTop: 12,
    },
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
        fontWeight: '400',
    },
    blendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SearchBarSkeleton;
