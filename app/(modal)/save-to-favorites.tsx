import { Theme } from '@/constants/theme';
import { Text } from '@/src/components/ui';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SaveToFavoritesModal() {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.backdrop}>
            <Pressable style={styles.backdropTouchable} onPress={() => router.back()} />

            <View style={[styles.modalContainer, { paddingBottom: insets.bottom + 20 }]}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.dragHandle} />
                    <Text weight="bold" style={styles.title}>
                        Save To Favorites
                    </Text>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <Text style={styles.placeholder}>
                        Favorites feature coming soon! 🎨
                    </Text>
                    <Text style={styles.placeholderSubtext}>
                        iOS-style modal with CardStyleInterpolators.forModalPresentationIOS
                    </Text>
                </View>

                {/* Close Button */}
                <Pressable style={styles.closeButton} onPress={() => router.back()}>
                    <Text weight="semibold" style={styles.closeButtonText}>
                        Close
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    backdropTouchable: {
        flex: 1,
    },
    modalContainer: {
        backgroundColor: Theme.colors.background.dark,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        minHeight: 400,
        maxHeight: '80%',
    },
    header: {
        paddingTop: 8,
        paddingHorizontal: 20,
        paddingBottom: 16,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 2,
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        color: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    placeholder: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 12,
    },
    placeholderSubtext: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'center',
    },
    closeButton: {
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: Theme.colors.primary.main,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});
