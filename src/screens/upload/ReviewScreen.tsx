/**
 * ReviewScreen — /upload/review
 *
 * Shows selected images in a swipeable carousel. Below the carousel is a
 * TagSelector for the currently-visible image. For the first image, an
 * "Apply tags to all" button is shown once tags are selected.
 *
 * "Create" button (bottom-right) starts the upload. A progress overlay covers
 * the screen during upload. On success, navigates back to /(tabs).
 */
import { uploadPost } from '@services/api/upload.service';
import { useUploadStore } from '@store/slices/uploadSlice';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { CheckCircle } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    useColorScheme,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TagSelector } from './components/TagSelector';
import { Theme } from '@constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAROUSEL_HEIGHT = SCREEN_WIDTH * 0.85;

export default function ReviewScreen() {
    const insets = useSafeAreaInsets();
    const isDark = useColorScheme() === 'dark';

    const selectedImages = useUploadStore((s) => s.selectedImages);
    const tagsPerImage = useUploadStore((s) => s.tagsPerImage);
    const setTagsForImage = useUploadStore((s) => s.setTagsForImage);
    const applyTagsToAll = useUploadStore((s) => s.applyTagsToAll);
    const uploadProgress = useUploadStore((s) => s.uploadProgress);
    const isUploading = useUploadStore((s) => s.isUploading);
    const setUploadProgress = useUploadStore((s) => s.setUploadProgress);
    const setIsUploading = useUploadStore((s) => s.setIsUploading);
    const reset = useUploadStore((s) => s.reset);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [uploadDone, setUploadDone] = useState(false);

    // Guard: if state was lost (e.g. hot reload), navigate back.
    // Must be in a useEffect — never call router.* during render.
    useEffect(() => {
        if (selectedImages.length === 0) {
            router.replace('/upload' as any);
        }
    }, []);

    const bgColor = isDark ? Theme.colors.background.dark : Theme.colors.background.light;
    const textColor = isDark ? '#fff' : '#111';
    const subColor = isDark ? '#999' : '#666';
    const divider = isDark ? '#2A2A2A' : '#EEEEEE';

    const overlayOpacity = useSharedValue(0);
    const overlayStyle = useAnimatedStyle(() => ({
        opacity: overlayOpacity.value,
        pointerEvents: overlayOpacity.value > 0 ? 'auto' : 'none',
    }));

    const handleUpload = useCallback(async () => {
        if (selectedImages.length === 0) return;

        setIsUploading(true);
        setUploadProgress(0);
        overlayOpacity.value = withTiming(1, { duration: 200 });

        try {
            await uploadPost(
                selectedImages,
                tagsPerImage,
                (progress) => setUploadProgress(progress)
            );

            setUploadDone(true);
            setUploadProgress(100);

            // Brief success pause then pop back to tabs.
            // router.navigate finds the existing /(tabs) entry in the stack
            // and pops everything on top of it — no dismissAll needed.
            setTimeout(() => {
                reset();
                router.navigate('/(tabs)' as any);
            }, 1200);
        } catch (err: any) {
            overlayOpacity.value = withTiming(0, { duration: 200 });
            setIsUploading(false);
            Alert.alert(
                'Upload failed',
                err?.response?.data?.message || err?.message || 'Something went wrong. Please try again.',
                [{ text: 'OK' }]
            );
        }
    }, [selectedImages, tagsPerImage, setIsUploading, setUploadProgress, reset]);

    const currentTags = tagsPerImage[currentIndex] ?? [];

    const handleTagChange = useCallback(
        (tags: string[]) => setTagsForImage(currentIndex, tags),
        [currentIndex, setTagsForImage]
    );

    const handleApplyToAll = useCallback(() => {
        applyTagsToAll(currentTags);
    }, [applyTagsToAll, currentTags]);

    // Render nothing while the effect-based redirect fires
    if (selectedImages.length === 0) return null;

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
                <Pressable
                    style={styles.backBtn}
                    onPress={() => router.back()}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    disabled={isUploading}
                >
                    <Text style={[styles.backText, { color: textColor }]}>‹ Back</Text>
                </Pressable>

                <Text style={[styles.headerTitle, { color: textColor }]}>Review Post</Text>

                <View style={styles.headerRight} />
            </View>

            <ScrollView
                style={styles.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Image carousel */}
                <View style={styles.carouselWrapper}>
                    <Carousel
                        width={SCREEN_WIDTH}
                        height={CAROUSEL_HEIGHT}
                        data={selectedImages}
                        loop={false}
                        onSnapToItem={setCurrentIndex}
                        renderItem={({ item }) => (
                            <View style={styles.slide}>
                                <Image
                                    source={{ uri: item.uri }}
                                    style={styles.carouselImage}
                                    contentFit="contain"
                                />
                            </View>
                        )}
                    />

                    {/* Dot indicators */}
                    {selectedImages.length > 1 && (
                        <View style={styles.dots}>
                            {selectedImages.map((_, i) => (
                                <View
                                    key={i}
                                    style={[
                                        styles.dot,
                                        {
                                            backgroundColor:
                                                i === currentIndex ? '#7C3AED' : (isDark ? '#555' : '#ccc'),
                                            width: i === currentIndex ? 16 : 6,
                                        },
                                    ]}
                                />
                            ))}
                        </View>
                    )}

                    {/* Image counter */}
                    <View style={styles.counter}>
                        <Text style={styles.counterText}>
                            {currentIndex + 1} / {selectedImages.length}
                        </Text>
                    </View>
                </View>

                {/* Divider */}
                <View style={[styles.divider, { backgroundColor: divider }]} />

                {/* Tags for current image */}
                <Text style={[styles.tagsLabel, { color: subColor }]}>
                    Tags for image {currentIndex + 1}
                </Text>

                <TagSelector
                    selectedTags={currentTags}
                    onChange={handleTagChange}
                    onApplyToAll={currentIndex === 0 && selectedImages.length > 1
                        ? handleApplyToAll
                        : undefined}
                />

                {/* Bottom spacing so "Create" button doesn't overlap content */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Create button (fixed bottom-right) */}
            {!isUploading && (
                <View style={[styles.createBtnContainer, { paddingBottom: insets.bottom + 16 }]}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.createBtn,
                            pressed && styles.createBtnPressed,
                        ]}
                        onPress={handleUpload}
                    >
                        <Text style={styles.createBtnText}>
                            Create {selectedImages.length > 1 ? `(${selectedImages.length})` : ''}
                        </Text>
                    </Pressable>
                </View>
            )}

            {/* Upload progress overlay */}
            <Animated.View style={[styles.overlay, overlayStyle]}>
                <View style={styles.overlayCard}>
                    {uploadDone ? (
                        <>
                            <CheckCircle size={48} color="#7C3AED" />
                            <Text style={styles.overlayTitle}>Posted!</Text>
                            <Text style={styles.overlaySub}>
                                {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''} uploaded
                            </Text>
                        </>
                    ) : (
                        <>
                            <Text style={styles.overlayTitle}>Uploading…</Text>
                            <Text style={styles.overlaySub}>
                                {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''}
                            </Text>

                            {/* Progress bar */}
                            <View style={styles.progressTrack}>
                                <View
                                    style={[
                                        styles.progressFill,
                                        { width: `${uploadProgress}%` },
                                    ]}
                                />
                            </View>
                            <Text style={styles.progressPct}>{uploadProgress}%</Text>
                        </>
                    )}
                </View>
            </Animated.View>
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
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    backBtn: {
        width: 60,
    },
    backText: {
        fontSize: 16,
        fontWeight: '500',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '700',
        fontFamily: 'GoogleSansFlex_700Bold',
    },
    headerRight: {
        width: 60,
    },
    scroll: {
        flex: 1,
    },
    carouselWrapper: {
        position: 'relative',
    },
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    carouselImage: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    dots: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        marginTop: 10,
    },
    dot: {
        height: 6,
        borderRadius: 3,
    },
    counter: {
        position: 'absolute',
        top: 12,
        right: 24,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    counterText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 4,
    },
    tagsLabel: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    createBtnContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        paddingHorizontal: 20,
        alignItems: 'flex-end',
    },
    createBtn: {
        backgroundColor: '#7C3AED',
        borderRadius: 28,
        paddingHorizontal: 28,
        paddingVertical: 14,
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    createBtnPressed: {
        opacity: 0.85,
    },
    createBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        fontFamily: 'GoogleSansFlex_700Bold',
    },
    // Upload overlay
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.75)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    overlayCard: {
        backgroundColor: '#1E1E1E',
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
        width: '80%',
        gap: 12,
    },
    overlayTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        fontFamily: 'GoogleSansFlex_700Bold',
    },
    overlaySub: {
        color: '#aaa',
        fontSize: 14,
    },
    progressTrack: {
        width: '100%',
        height: 6,
        backgroundColor: '#333',
        borderRadius: 3,
        overflow: 'hidden',
        marginTop: 4,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#7C3AED',
        borderRadius: 3,
    },
    progressPct: {
        color: '#7C3AED',
        fontSize: 13,
        fontWeight: '600',
    },
});
