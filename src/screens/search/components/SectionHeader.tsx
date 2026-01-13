import { FontFamily } from '@/constants/theme';
import { Text } from '@/src/components/ui';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Pressable,
    StyleSheet,
    View,
    useColorScheme,
} from 'react-native';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    onPress?: () => void;
}

/**
 * Reusable section header with title, optional subtitle, and chevron.
 * Apple TV / Apple Movies style.
 */
export default function SectionHeader({ title, subtitle, onPress }: SectionHeaderProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const titleColor = isDark ? '#FFFFFF' : '#000000';
    const subtitleColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';
    const chevronColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';

    return (
        <Pressable
            onPress={onPress}
            disabled={!onPress}
            style={({ pressed }) => [
                styles.container,
                pressed && onPress && styles.pressed,
            ]}
        >
            <View style={styles.textContainer}>
                <View style={styles.titleRow}>
                    <Text
                        style={[
                            styles.title,
                            {
                                color: titleColor,
                                fontFamily: FontFamily.semibold,
                            },
                        ]}
                    >
                        {title}
                    </Text>
                    {onPress && (
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color={chevronColor}
                            style={styles.chevron}
                        />
                    )}
                </View>
                {subtitle && (
                    <Text
                        style={[
                            styles.subtitle,
                            { color: subtitleColor },
                        ]}
                        numberOfLines={1}
                    >
                        {subtitle}
                    </Text>
                )}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
    },
    pressed: {
        opacity: 0.7,
    },
    textContainer: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
    },
    chevron: {
        marginLeft: 4,
    },
    subtitle: {
        fontSize: 14,
        lineHeight: 20,
        marginTop: 2,
    },
});
