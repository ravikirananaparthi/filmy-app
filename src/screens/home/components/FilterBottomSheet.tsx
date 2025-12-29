import { Text } from '@/src/components/ui';
import { Theme } from '@constants/theme';
import * as Haptics from 'expo-haptics';
import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
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

interface Tag {
    id: string;
    name: string;
    usage_count?: number;
}

interface FilterBottomSheetProps {
    isVisible: boolean;
    onClose: () => void;
    selectedTags: string[];
    availableTags: Tag[];
    onApply: (tags: string[]) => void;
    onClear: () => void;
}

export const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({
    isVisible,
    onClose,
    selectedTags,
    availableTags,
    onApply,
    onClear,
}) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const translateY = useSharedValue(0);

    // Local state for draft selection
    const [draftTags, setDraftTags] = useState<string[]>(selectedTags);

    React.useEffect(() => {
        setDraftTags(selectedTags);
    }, [selectedTags, isVisible]);

    const backgroundColor = isDark
        ? Theme.colors.background.surface.dark
        : Theme.colors.background.surface.light;

    const textColor = isDark
        ? Theme.colors.text.primary
        : Theme.colors.textLight.primary;

    const chipBackground = isDark
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.05)';

    const toggleTag = (tagName: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setDraftTags((prev) =>
            prev.includes(tagName)
                ? prev.filter((t) => t !== tagName)
                : [...prev, tagName]
        );
    };

    const handleApply = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onApply(draftTags);
        onClose();
    };

    const handleClear = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setDraftTags([]);
        onClear();
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
                        style={[styles.sheet, { backgroundColor }, animatedStyle]}
                    >
                        {/* Handle */}
                        <View style={styles.handleContainer}>
                            <View style={[styles.handle, { backgroundColor: chipBackground }]} />
                        </View>

                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={[styles.title, { color: textColor }]}>Filters</Text>
                            <Pressable onPress={onClose} style={styles.closeButton}>
                                <X size={24} color={textColor} />
                            </Pressable>
                        </View>

                        {/* Tags Section */}
                        <Text style={[styles.sectionTitle, { color: textColor }]}>
                            Tags
                        </Text>
                        <ScrollView
                            style={styles.tagsScrollView}
                            contentContainerStyle={styles.tagsContainer}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.tagsGrid}>
                                {availableTags.map((tag) => {
                                    const isSelected = draftTags.includes(tag.name);
                                    return (
                                        <Pressable
                                            key={tag.id}
                                            style={[
                                                styles.tagChip,
                                                {
                                                    backgroundColor: isSelected
                                                        ? Theme.colors.primary.main
                                                        : chipBackground,
                                                },
                                            ]}
                                            onPress={() => toggleTag(tag.name)}
                                        >
                                            <Text
                                                style={[
                                                    styles.tagText,
                                                    { color: isSelected ? '#FFFFFF' : textColor },
                                                ]}
                                            >
                                                {tag.name}
                                            </Text>
                                            {tag.usage_count !== undefined && (
                                                <Text
                                                    style={[
                                                        styles.tagCount,
                                                        {
                                                            color: isSelected
                                                                ? 'rgba(255,255,255,0.7)'
                                                                : isDark
                                                                    ? Theme.colors.text.tertiary
                                                                    : Theme.colors.textLight.tertiary,
                                                        },
                                                    ]}
                                                >
                                                    {tag.usage_count}
                                                </Text>
                                            )}
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </ScrollView>

                        {/* Action Buttons */}
                        <View style={styles.actions}>
                            <Pressable
                                style={[styles.button, styles.clearButton, { backgroundColor: chipBackground }]}
                                onPress={handleClear}
                            >
                                <Text style={[styles.buttonText, { color: textColor }]}>
                                    Clear All
                                </Text>
                            </Pressable>
                            <Pressable
                                style={[
                                    styles.button,
                                    styles.applyButton,
                                    { backgroundColor: Theme.colors.primary.main },
                                ]}
                                onPress={handleApply}
                            >
                                <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
                                    Apply Filters
                                </Text>
                            </Pressable>
                        </View>
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
        maxHeight: '80%',
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
    },
    closeButton: {
        padding: 4,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        paddingHorizontal: 20,
        marginBottom: 12,
        opacity: 0.7,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    tagsScrollView: {
        maxHeight: 250,
    },
    tagsContainer: {
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    tagsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tagChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: Theme.radius.full,
        gap: 6,
    },
    tagText: {
        fontSize: 14,
        fontWeight: '500',
    },
    tagCount: {
        fontSize: 12,
        fontWeight: '400',
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: Theme.radius.lg,
        alignItems: 'center',
    },
    clearButton: {},
    applyButton: {},
    buttonText: {
        fontSize: 15,
        fontWeight: '600',
    },
});

export default FilterBottomSheet;
