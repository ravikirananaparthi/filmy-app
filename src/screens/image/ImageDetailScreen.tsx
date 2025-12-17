import { Theme } from '@constants/theme';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ImageDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const insets = useSafeAreaInsets();

    const backgroundColor = isDark
        ? Theme.colors.background.dark
        : Theme.colors.background.light;

    const textColor = isDark
        ? Theme.colors.text.primary
        : Theme.colors.textLight.primary;

    return (
        <View style={[styles.container, { backgroundColor, paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={textColor} />
                </Pressable>
                <Text style={[styles.title, { color: textColor }]}>Image Detail</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Content Placeholder */}
            <View style={styles.content}>
                <Text style={[styles.placeholderText, { color: textColor }]}>
                    Image ID: {id}
                </Text>
                <Text style={[styles.subtitle, { color: textColor }]}>
                    Carousel viewer will be implemented here
                </Text>
                <Text style={[styles.hint, { color: isDark ? Theme.colors.text.tertiary : Theme.colors.textLight.tertiary }]}>
                    Using react-native-reanimated-carousel for swipeable gallery
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        padding: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    placeholderText: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
    },
    hint: {
        fontSize: 14,
        textAlign: 'center',
    },
});
