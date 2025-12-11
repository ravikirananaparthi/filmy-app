import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AnimatedHeader } from '@/components/ui/animated-header';
import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { memo, useCallback } from 'react';
import { Dimensions, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useMotionify } from 'react-native-motionify';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 52) / 2;
const CARD_COLORS = [Theme.palette.primary, Theme.palette.accent, Theme.palette.primaryDark, Theme.palette.primaryLight, Theme.palette.muted, Theme.colors.status.error];

interface FavoriteItem {
  id: string;
  title: string;
  category: string;
  rating: number;
  colorIndex: number;
}

const FavoriteCard = memo(function FavoriteCard({ item }: { item: FavoriteItem }) {
  const backgroundColor = CARD_COLORS[item.colorIndex % CARD_COLORS.length];
  const handlePress = useCallback(() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }, []);

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8} style={styles.favoriteCard}>
      <View style={[styles.cardImagePlaceholder, { backgroundColor }]}>
        <View style={styles.playButton}><Ionicons name="expand-outline" size={20} color={Theme.colors.text.primary} /></View>
        <View style={styles.favoriteBadge}><Ionicons name="heart" size={14} color={Theme.palette.accent} /></View>
      </View>
      <View style={styles.cardInfo}>
        <ThemedText style={styles.cardCategory}>{item.category}</ThemedText>
        <ThemedText style={styles.cardTitle} numberOfLines={1}>{item.title}</ThemedText>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={12} color={Theme.colors.status.warning} />
          <ThemedText style={styles.ratingText}>{item.rating}</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const favoritesData: FavoriteItem[] = [
  { id: '1', title: 'Mountain Sunset', category: 'Nature', rating: 9.3, colorIndex: 0 },
  { id: '2', title: 'City Lights', category: 'Urban', rating: 9.5, colorIndex: 1 },
  { id: '3', title: 'Ocean Waves', category: 'Nature', rating: 9.1, colorIndex: 2 },
  { id: '4', title: 'Abstract Art', category: 'Art', rating: 9.0, colorIndex: 3 },
  { id: '5', title: 'Galaxy View', category: 'Space', rating: 8.9, colorIndex: 4 },
  { id: '6', title: 'Forest Path', category: 'Nature', rating: 8.8, colorIndex: 5 },
  { id: '7', title: 'Neon Dreams', category: 'Abstract', rating: 9.2, colorIndex: 0 },
  { id: '8', title: 'Desert Dunes', category: 'Nature', rating: 8.7, colorIndex: 1 },
];

const StatsBar = memo(function StatsBar() {
  return (
    <View style={styles.statsBar}>
      <View style={styles.statItem}><ThemedText style={styles.statValue}>{favoritesData.length}</ThemedText><ThemedText style={styles.statLabel}>Wallpapers</ThemedText></View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}><ThemedText style={styles.statValue}>6</ThemedText><ThemedText style={styles.statLabel}>Categories</ThemedText></View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}><ThemedText style={styles.statValue}>4K</ThemedText><ThemedText style={styles.statLabel}>Quality</ThemedText></View>
    </View>
  );
});

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const { onScroll } = useMotionify();

  const renderItem = useCallback(({ item }: { item: FavoriteItem }) => <FavoriteCard item={item} />, []);
  const keyExtractor = useCallback((item: FavoriteItem) => item.id, []);

  const ListHeaderComponent = useCallback(() => <StatsBar />, []);

  return (
    <ThemedView style={styles.container}>
      <AnimatedHeader title="❤️ Favorites" subtitle={`${favoritesData.length} wallpapers saved`} />
      <FlatList
        data={favoritesData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 100 + insets.top, paddingBottom: 120, paddingHorizontal: 16 }}
        ListHeaderComponent={ListHeaderComponent}
        removeClippedSubviews={true}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background.dark },
  statsBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 16, borderRadius: 20, backgroundColor: Theme.colors.background.surface.dark, borderWidth: 1, borderColor: `${Theme.palette.primary}33`, marginBottom: 20 },
  statItem: { alignItems: 'center' },
  statValue: { color: Theme.colors.text.primary, fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: Theme.colors.text.secondary, fontSize: 12, marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: `${Theme.palette.primary}4D` },
  columnWrapper: { gap: 16, marginBottom: 16 },
  favoriteCard: { width: CARD_WIDTH, borderRadius: 20, overflow: 'hidden', backgroundColor: Theme.colors.background.surface.dark, borderWidth: 1, borderColor: `${Theme.palette.primary}33` },
  cardImagePlaceholder: { height: 140, justifyContent: 'center', alignItems: 'center' },
  playButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: Theme.colors.overlay.dark, justifyContent: 'center', alignItems: 'center' },
  favoriteBadge: { position: 'absolute', top: 10, right: 10, width: 28, height: 28, borderRadius: 14, backgroundColor: Theme.colors.overlay.dark, justifyContent: 'center', alignItems: 'center' },
  cardInfo: { padding: 12 },
  cardCategory: { color: Theme.colors.text.secondary, fontSize: 11, textTransform: 'uppercase', fontWeight: '600' },
  cardTitle: { color: Theme.colors.text.primary, fontSize: 14, fontWeight: '600', marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  ratingText: { color: Theme.colors.status.warning, fontSize: 12, fontWeight: '600' },
});
