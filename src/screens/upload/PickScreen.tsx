/**
 * PickScreen — /upload/pick
 *
 * Custom gallery picker built on expo-media-library (already linked in the
 * current dev client — no rebuild needed).
 *
 * Features:
 *  - 3-column scrollable grid of recent photos
 *  - Multi-select up to 10 (numbered badges in tap order)
 *  - Infinite scroll (loads 60 at a time)
 *  - "Next →" button in header, enabled once ≥1 image is selected
 *  - Resolves ph:// → file:// on iOS before storing in uploadStore
 */
import * as MediaLibrary from 'expo-media-library';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Platform,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View,
    useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUploadStore, type SelectedImage } from '@store/slices/uploadSlice';
import { Theme } from '@constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GAP = 2;
const COLUMNS = 3;
const ITEM_SIZE = (SCREEN_WIDTH - GAP * (COLUMNS - 1)) / COLUMNS;
const PAGE_SIZE = 60;
const MAX_SELECT = 10;

export default function PickScreen() {
    const insets = useSafeAreaInsets();
    const isDark = useColorScheme() === 'dark';

    const setSelectedImages = useUploadStore((s) => s.setSelectedImages);

    const [permissionStatus, setPermissionStatus] = useState<'undetermined' | 'granted' | 'denied'>('undetermined');
    const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [endCursor, setEndCursor] = useState<string | undefined>();
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [processingNext, setProcessingNext] = useState(false);

    const bgColor = isDark ? Theme.colors.background.dark : Theme.colors.background.light;
    const textColor = isDark ? '#fff' : '#111';
    const subColor = isDark ? '#999' : '#666';

    // ─── Permissions + initial load ───────────────────────────────────────────
    useEffect(() => {
        (async () => {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            setPermissionStatus(status as any);
            if (status === 'granted') {
                await fetchPage();
            }
            setLoading(false);
        })();
    }, []);

    const fetchPage = useCallback(async (after?: string) => {
        if (loadingMore) return;
        setLoadingMore(true);
        try {
            const result = await MediaLibrary.getAssetsAsync({
                mediaType: MediaLibrary.MediaType.photo,
                first: PAGE_SIZE,
                after,
                sortBy: [[MediaLibrary.SortBy.creationTime, false]],
            });
            setAssets((prev) => (after ? [...prev, ...result.assets] : result.assets));
            setEndCursor(result.endCursor);
            setHasMore(result.hasNextPage);
        } finally {
            setLoadingMore(false);
        }
    }, [loadingMore]);

    const handleLoadMore = useCallback(() => {
        if (hasMore && !loadingMore && endCursor) {
            fetchPage(endCursor);
        }
    }, [hasMore, loadingMore, endCursor, fetchPage]);

    // ─── Selection ────────────────────────────────────────────────────────────
    const toggleSelect = useCallback((id: string) => {
        setSelectedIds((prev) => {
            if (prev.includes(id)) return prev.filter((x) => x !== id);
            if (prev.length >= MAX_SELECT) {
                Alert.alert('Maximum reached', `You can select up to ${MAX_SELECT} images.`);
                return prev;
            }
            return [...prev, id];
        });
    }, []);

    // ─── Navigate to review ───────────────────────────────────────────────────
    const handleNext = useCallback(async () => {
        if (selectedIds.length === 0 || processingNext) return;
        setProcessingNext(true);

        try {
            // Keep selection order by mapping selectedIds → assets
            const ordered = selectedIds
                .map((id) => assets.find((a) => a.id === id))
                .filter((a): a is MediaLibrary.Asset => !!a);

            const images: SelectedImage[] = await Promise.all(
                ordered.map(async (asset) => {
                    let uri = asset.uri;

                    if (Platform.OS === 'ios') {
                        // ph:// URIs can't be used in FormData — resolve to file://
                        const info = await MediaLibrary.getAssetInfoAsync(asset);
                        if (!info.localUri) {
                            // Photo is in iCloud and not downloaded locally — skip it
                            Alert.alert(
                                'Photo not available',
                                `"${asset.filename}" is stored in iCloud and not downloaded to this device. Open it in Photos first, then try again.`
                            );
                            throw new Error('icloud_not_downloaded');
                        }
                        uri = info.localUri;
                    }

                    const ext = asset.filename.split('.').pop()?.toLowerCase() ?? 'jpg';
                    const mime =
                        ext === 'heic' || ext === 'heif' ? 'image/heic'
                        : ext === 'png' ? 'image/png'
                        : ext === 'webp' ? 'image/webp'
                        : 'image/jpeg';

                    return {
                        uri,
                        width: asset.width,
                        height: asset.height,
                        type: mime,
                        fileName: asset.filename,
                    };
                })
            );

            setSelectedImages(images);
            router.push('/upload/review' as any);
        } catch (err: any) {
            Alert.alert('Error', 'Could not load selected images. Please try again.');
        } finally {
            setProcessingNext(false);
        }
    }, [selectedIds, assets, setSelectedImages, processingNext]);

    // ─── Render item ──────────────────────────────────────────────────────────
    const renderItem = useCallback(({ item }: { item: MediaLibrary.Asset }) => {
        const selIdx = selectedIds.indexOf(item.id);
        const isSelected = selIdx >= 0;

        return (
            <Pressable
                style={[styles.item, { width: ITEM_SIZE, height: ITEM_SIZE }]}
                onPress={() => toggleSelect(item.id)}
            >
                <Image
                    source={{ uri: item.uri }}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                    recyclingKey={item.id}
                />
                {isSelected && (
                    <>
                        <View style={styles.selectedOverlay} />
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{selIdx + 1}</Text>
                        </View>
                    </>
                )}
            </Pressable>
        );
    }, [selectedIds, toggleSelect]);

    const keyExtractor = useCallback((item: MediaLibrary.Asset) => item.id, []);

    // ─── Render ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <View style={[styles.centered, { backgroundColor: bgColor }]}>
                <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
                <ActivityIndicator size="large" color="#7C3AED" />
            </View>
        );
    }

    if (permissionStatus === 'denied') {
        return (
            <View style={[styles.centered, { backgroundColor: bgColor }]}>
                <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
                <Text style={[styles.permText, { color: textColor }]}>
                    Photo access is required to upload images.
                </Text>
                <Text style={[styles.permSub, { color: subColor }]}>
                    Enable it in your device Settings → Filmy.
                </Text>
                <Pressable
                    style={styles.backBtn2}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backBtn2Text}>Go Back</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
                <Pressable
                    style={styles.closeBtn}
                    onPress={() => router.back()}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                    <Text style={[styles.closeBtnText, { color: textColor }]}>✕</Text>
                </Pressable>

                <Text style={[styles.title, { color: textColor }]}>
                    {selectedIds.length > 0
                        ? `${selectedIds.length} / ${MAX_SELECT} selected`
                        : 'Select Photos'}
                </Text>

                <Pressable
                    style={[
                        styles.nextBtn,
                        selectedIds.length === 0 && styles.nextBtnDisabled,
                    ]}
                    onPress={handleNext}
                    disabled={selectedIds.length === 0 || processingNext}
                >
                    {processingNext ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.nextBtnText}>Next →</Text>
                    )}
                </Pressable>
            </View>

            {/* Photo grid */}
            <FlatList
                data={assets}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                numColumns={COLUMNS}
                columnWrapperStyle={styles.row}
                showsVerticalScrollIndicator={false}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.4}
                ListFooterComponent={
                    loadingMore ? (
                        <ActivityIndicator
                            size="small"
                            color="#7C3AED"
                            style={{ marginVertical: 16 }}
                        />
                    ) : null
                }
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={[styles.emptyText, { color: subColor }]}>
                            No photos found.
                        </Text>
                    </View>
                }
                getItemLayout={(_, index) => ({
                    length: ITEM_SIZE + GAP,
                    offset: (ITEM_SIZE + GAP) * Math.floor(index / COLUMNS),
                    index,
                })}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        gap: 12,
    },
    permText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    permSub: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
    backBtn2: {
        marginTop: 12,
        backgroundColor: '#7C3AED',
        borderRadius: 20,
        paddingHorizontal: 24,
        paddingVertical: 10,
    },
    backBtn2Text: { color: '#fff', fontWeight: '700', fontSize: 14 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingBottom: 10,
    },
    closeBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
    closeBtnText: { fontSize: 18, fontWeight: '600' },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '700',
        fontFamily: 'GoogleSansFlex_700Bold',
    },
    nextBtn: {
        backgroundColor: '#7C3AED',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        minWidth: 72,
        alignItems: 'center',
    },
    nextBtnDisabled: { backgroundColor: '#7C3AED55' },
    nextBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
        fontFamily: 'GoogleSansFlex_700Bold',
    },
    row: { gap: GAP, marginBottom: GAP },
    item: { overflow: 'hidden' },
    selectedOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(124, 58, 237, 0.35)',
    },
    badge: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#7C3AED',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#fff',
    },
    badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
    empty: { padding: 32, alignItems: 'center' },
    emptyText: { fontSize: 14 },
});
