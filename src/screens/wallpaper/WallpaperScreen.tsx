import { BackIcon } from '@/components/icons/ui-icons/back-icon';
import { Theme } from '@/constants/theme';
import type { Image } from '@/src/types/image.types';
import { useQueryClient } from '@tanstack/react-query';
import * as FileSystem from 'expo-file-system/legacy';
import { Image as ExpoImage } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
    Alert,
    Dimensions,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    ToastAndroid,
    View,
} from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Spring config for smooth animations
const SPRING_CONFIG = {
    damping: 20,
    stiffness: 200,
};

/**
 * WallpaperScreen - Adjust and set image as wallpaper
 * Features: Pinch-to-zoom, pan gestures, phone frame overlay
 */
export default function WallpaperScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const insets = useSafeAreaInsets();
    const queryClient = useQueryClient();
    const [isSettingWallpaper, setIsSettingWallpaper] = useState(false);

    // Get cached feed data
    const cachedData = queryClient.getQueryData(['feed', 'for-you', { limit: 20 }]) as any;
    const allImages: Image[] = useMemo(() => {
        if (!cachedData?.pages) return [];
        return cachedData.pages.flatMap((page: any) => page.data || []);
    }, [cachedData]);

    const currentImage = allImages.find((img) => img.id === id);

    // Gesture values
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const savedTranslateX = useSharedValue(0);
    const savedTranslateY = useSharedValue(0);

    // Pinch gesture
    const pinchGesture = Gesture.Pinch()
        .onUpdate((event) => {
            scale.value = Math.max(0.5, Math.min(savedScale.value * event.scale, 4));
        })
        .onEnd(() => {
            savedScale.value = scale.value;
            // Snap to minimum scale if too small
            if (scale.value < 1) {
                scale.value = withSpring(1, SPRING_CONFIG);
                savedScale.value = 1;
            }
        });

    // Pan gesture
    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = savedTranslateX.value + event.translationX;
            translateY.value = savedTranslateY.value + event.translationY;
        })
        .onEnd(() => {
            savedTranslateX.value = translateX.value;
            savedTranslateY.value = translateY.value;
        });

    // Combined gesture
    const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

    // Animated style
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
    }));

    // Back handler
    const handleBack = useCallback(() => {
        router.back();
    }, []);

    // Set as wallpaper handler - saves to gallery
    const handleSetWallpaper = useCallback(async () => {
        if (!currentImage) {
            Alert.alert('Error', 'Image not found. Please go back and try again.');
            return;
        }

        setIsSettingWallpaper(true);

        try {
            // Request permission
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please allow access to save the image.');
                setIsSettingWallpaper(false);
                return;
            }

            // Download image to local file first
            const fileName = `wallpaper_${currentImage.id}.jpg`;
            const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

            const downloadResult = await FileSystem.downloadAsync(
                currentImage.image_url,
                fileUri
            );

            if (downloadResult.status !== 200) {
                throw new Error(`Download failed with status ${downloadResult.status}`);
            }

            // Save to gallery
            await MediaLibrary.saveToLibraryAsync(downloadResult.uri);

            if (Platform.OS === 'android') {
                ToastAndroid.show('Image saved to gallery!', ToastAndroid.SHORT);
                Alert.alert(
                    'Saved to Gallery',
                    'To set as wallpaper:\n\n1. Open Gallery/Photos\n2. Long press the image\n3. Select "Set as Wallpaper"'
                );
            } else {
                Alert.alert(
                    'Saved to Photos',
                    'To set as wallpaper:\n\n1. Open Photos app\n2. Select this image\n3. Tap Share\n4. Choose "Use as Wallpaper"'
                );
            }
        } catch (error: any) {
            console.error('Failed to save wallpaper:', error);
            const errorMessage = error?.message || 'Unknown error';
            if (Platform.OS === 'android') {
                ToastAndroid.show(`Failed: ${errorMessage}`, ToastAndroid.LONG);
            } else {
                Alert.alert('Error', `Failed to save image: ${errorMessage}`);
            }
        } finally {
            setIsSettingWallpaper(false);
        }
    }, [currentImage]);

    if (!currentImage) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Image not found</Text>
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.container}>
                {/* Zoomable/Pannable Image */}
                <GestureDetector gesture={composedGesture}>
                    <Animated.View style={[styles.imageContainer, animatedStyle]}>
                        <ExpoImage
                            source={{ uri: currentImage.image_url }}
                            style={styles.image}
                            contentFit="cover"
                            placeholder={{ blurhash: currentImage.blurhash }}
                        />
                    </Animated.View>
                </GestureDetector>

                {/* Phone Frame Overlay */}
                <View style={styles.overlayContainer} pointerEvents="none">
                    {/* Top dark area */}
                    <View style={[styles.darkArea, { height: insets.top + 40 }]} />

                    {/* Bottom dark area with rounded corners */}
                    <View style={styles.bottomOverlay}>
                        <View style={styles.darkArea} />
                    </View>
                </View>

                {/* Top Bar */}
                <View style={[styles.topBar, { paddingTop: insets.top + 12 }]}>
                    <Pressable style={styles.iconButton} onPress={handleBack}>
                        <BackIcon size={22} color="#fff" />
                    </Pressable>
                    <Text style={styles.title}>Adjust Wallpaper</Text>
                    <View style={styles.iconButton} />
                </View>

                {/* Bottom Button */}
                <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
                    <Text style={styles.hint}>Pinch to zoom, drag to adjust</Text>
                    <Pressable
                        style={[styles.setButton, isSettingWallpaper && styles.setButtonDisabled]}
                        onPress={handleSetWallpaper}
                        disabled={isSettingWallpaper}
                    >
                        <Text style={styles.setButtonText}>
                            {isSettingWallpaper ? 'Setting...' : 'Set as Wallpaper'}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    imageContainer: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    },
    overlayContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'space-between',
    },
    darkArea: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    bottomOverlay: {
        height: 180,
    },
    topBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        zIndex: 10,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1e1e1e',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingHorizontal: 24,
        zIndex: 10,
    },
    hint: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 16,
    },
    setButton: {
        width: '100%',
        height: 52,
        borderRadius: 26,
        backgroundColor: Theme.colors.primary.main,
        justifyContent: 'center',
        alignItems: 'center',
    },
    setButtonDisabled: {
        opacity: 0.6,
    },
    setButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    errorText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 100,
    },
});
