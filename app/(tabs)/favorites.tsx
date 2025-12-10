import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AnimatedHeader } from '@/components/ui/animated-header';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { memo, useCallback } from 'react';
import { Dimensions, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useMotionify } from 'react-native-motionify';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 52) / 2;
const CARD_COLORS = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

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
        <View style={styles.playButton}><Ionicons name="expand-outline" size={20} color="#FFFFFF" /></View>
        <View style={styles.favoriteBadge}><Ionicons name="heart" size={14} color="#EC4899" /></View>
      </View>
      <View style={styles.cardInfo}>
        <ThemedText style={styles.cardCategory}>{item.category}</ThemedText>
        <ThemedText style={styles.cardTitle} numberOfLines={1}>{item.title}</ThemedText>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={12} color="#FBBF24" />
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
  container: { flex: 1, backgroundColor: '#0F0F19' },
  statsBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 16, borderRadius: 20, backgroundColor: 'rgba(30,30,45,0.8)', borderWidth: 1, borderColor: 'rgba(139,92,246,0.2)', marginBottom: 20 },
  statItem: { alignItems: 'center' },
  statValue: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: 'rgba(139,92,246,0.3)' },
  columnWrapper: { gap: 16, marginBottom: 16 },
  favoriteCard: { width: CARD_WIDTH, borderRadius: 20, overflow: 'hidden', backgroundColor: 'rgba(30,30,45,0.8)', borderWidth: 1, borderColor: 'rgba(139,92,246,0.2)' },
  cardImagePlaceholder: { height: 140, justifyContent: 'center', alignItems: 'center' },
  playButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  favoriteBadge: { position: 'absolute', top: 10, right: 10, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  cardInfo: { padding: 12 },
  cardCategory: { color: 'rgba(255,255,255,0.6)', fontSize: 11, textTransform: 'uppercase', fontWeight: '600' },
  cardTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  ratingText: { color: '#FBBF24', fontSize: 12, fontWeight: '600' },
});
