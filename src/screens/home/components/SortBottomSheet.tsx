import { Text } from '@/src/components/ui';
import { Theme } from '@constants/theme';
import * as Haptics from 'expo-haptics';
import { Check } from 'lucide-react-native';
import React from 'react';
import {
    Dimensions,
    Modal,
    Pressable,
    StyleSheet,
    View,
    useColorScheme,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { SORT_OPTIONS, SortOption } from '../hooks/useFilters';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SortBottomSheetProps {
    isVisible: boolean;
    onClose: () => void;
    selectedSort: SortOption;
    onSelect: (sort: SortOption) => void;
}

export const SortBottomSheet: React.FC<SortBottomSheetProps> = ({
    isVisible,
    onClose,
    selectedSort,
    onSelect,
}) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const translateY = useSharedValue(0);

    const backgroundColor = isDark
        ? Theme.colors.background.surface.dark
        : Theme.colors.background.surface.light;

    const textColor = isDark
        ? Theme.colors.text.primary
        : Theme.colors.textLight.primary;

    const dividerColor = isDark
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.05)';

    const handleSelect = (sort: SortOption) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onSelect(sort);
        onClose();
    };

    const gesture = Gesture.Pan()
        .onUpdate((e) => {
            translateY.value = Math.max(0, e.translationY);
        })
        .onEnd((e) => {
            if (e.translationY > 100) {
                runOnJS(onClose)();
            } else {
                translateY.value = withSpring(0, { damping: 20 });
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    if (!isVisible) return null;

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Pressable style={styles.backdrop} onPress={onClose} />

                <GestureDetector gesture={gesture}>
                    <Animated.View
                        style={[
                            styles.sheet,
                            { backgroundColor },
                            animatedStyle,
                        ]}
                    >
                        {/* Handle */}
                        <View style={styles.handleContainer}>
                            <View style={[styles.handle, { backgroundColor: dividerColor }]} />
                        </View>

                        {/* Title */}
                        <Text style={[styles.title, { color: textColor }]}>Sort By</Text>

                        {/* Options */}
                        {SORT_OPTIONS.map((option, index) => {
                            const isSelected = selectedSort === option.value;
                            return (
                                <React.Fragment key={option.value}>
                                    {index > 0 && (
                                        <View style={[styles.divider, { backgroundColor: dividerColor }]} />
                                    )}
                                    <Pressable
                                        style={styles.option}
                                        onPress={() => handleSelect(option.value)}
                                    >
                                        <Text
                                            style={[
                                                styles.optionText,
                                                { color: textColor },
                                                isSelected && styles.optionTextSelected,
                                            ]}
                                        >
                                            {option.label}
                                        </Text>
                                        {isSelected && (
                                            <Check
                                                size={20}
                                                color={Theme.colors.primary.main}
                                                strokeWidth={3}
                                            />
                                        )}
                                    </Pressable>
                                </React.Fragment>
                            );
                        })}
                    </Animated.View>
                </GestureDetector>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    sheet: {
        borderTopLeftRadius: Theme.radius.xxl,
        borderTopRightRadius: Theme.radius.xxl,
        paddingBottom: 40,
        ...Theme.shadows.lg,
    },
    handleContainer: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    handle: {
        width: 36,
        height: 4,
        borderRadius: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 16,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    optionText: {
        fontSize: 16,
        fontWeight: '500',
    },
    optionTextSelected: {
        color: Theme.colors.primary.main,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        marginHorizontal: 20,
    },
});

export default SortBottomSheet;
