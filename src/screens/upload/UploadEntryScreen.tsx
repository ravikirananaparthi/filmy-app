/**
 * UploadEntryScreen — /upload
 *
 * Transparent modal. The tabs screen is visible behind it.
 * TrueSheet slides up with its own native backdrop/dimming on top.
 *
 * Flow:
 *   + tap → present sheet → "Create a Post" → push /upload/pick
 *   swipe down or tap outside → onDismiss → router.back()
 */
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import { useUploadStore } from '@store/slices/uploadSlice';
import { router } from 'expo-router';
import { ImagePlus } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function UploadEntryScreen() {
    const insets = useSafeAreaInsets();
    const sheetRef = useRef<TrueSheet>(null);
    const reset = useUploadStore((s) => s.reset);

    // Track intentional forward navigation so onDismiss doesn't call router.back()
    const navigatingForwardRef = useRef(false);

    useEffect(() => {
        reset();
        // Present after the screen has mounted
        const t = setTimeout(() => sheetRef.current?.present(), 80);
        return () => clearTimeout(t);
    }, []);

    const handleDismiss = useCallback(() => {
        if (!navigatingForwardRef.current) {
            router.back();
        }
        navigatingForwardRef.current = false;
    }, []);

    const handleCreatePost = useCallback(() => {
        // Flag so onDismiss doesn't navigate back when sheet collapses
        navigatingForwardRef.current = true;
        router.push('/upload/pick' as any);
    }, []);

    return (
        // Transparent root — the tabs content shows through the modal background
        <View style={styles.root}>
            <TrueSheet
                ref={sheetRef}
                sizes={['auto']}
                cornerRadius={24}
                onDismiss={handleDismiss}
                backgroundColor="#1A1A1A"
                dismissible
            >
                <View style={[styles.content, { paddingBottom: Math.max(insets.bottom, 16) + 4 }]}>
                    {/* Drag handle */}
                    {/* <View style={styles.handle} /> */}

                    {/* Create a Post button */}
                    <Pressable
                        style={({ pressed }) => [
                            styles.createBtn,
                            pressed && styles.createBtnPressed,
                        ]}
                        onPress={handleCreatePost}
                    >
                        <View style={styles.iconCircle}>
                            <ImagePlus size={20} color="#fff" strokeWidth={2.2} />
                        </View>
                        <Text style={styles.createText}>Create a Post</Text>
                    </Pressable>
                </View>
            </TrueSheet>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    handle: {
        width: 36,
        height: 4,
        backgroundColor: '#555',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    createBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#7C3AED',
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 8,
    },
    createBtnPressed: {
        opacity: 0.82,
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    createText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        fontFamily: 'GoogleSansFlex_700Bold',
    },
});
