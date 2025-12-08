import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import React, { memo, useCallback } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 52) / 2;

// Simple colors for wallpaper placeholders
const CARD_COLORS = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

// Varying heights for masonry effect - simulating wallpapers with different aspect ratios
const CARD_HEIGHTS = [160, 220, 180, 200, 170, 240, 190, 210];

interface FavoriteItem {
  id: string;
  title: string;
  category: string;
  rating: number;
  colorIndex: number;
  height: number;
}

// Memoized card component - Important: no key prop inside, let FlashList handle it
const FavoriteCard = memo(function FavoriteCard({ item }: { item: FavoriteItem }) {
  const backgroundColor = CARD_COLORS[item.colorIndex % CARD_COLORS.length];

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      activeOpacity={0.8} 
      style={styles.favoriteCard}
    >
      {/* Wallpaper placeholder with varying height */}
      <View style={[styles.cardImagePlaceholder, { backgroundColor, height: item.height }]}>
        <View style={styles.playButton}>
          <Ionicons name="expand-outline" size={20} color="#FFFFFF" />
        </View>
        <View style={styles.favoriteBadge}>
          <Ionicons name="heart" size={14} color="#EC4899" />
        </View>
      </View>

      {/* Card Info */}
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

// Generate wallpaper data with varying heights
const favoritesData: FavoriteItem[] = [
  { id: '1', title: 'Mountain Sunset', category: 'Nature', rating: 9.3, colorIndex: 0, height: CARD_HEIGHTS[0] },
  { id: '2', title: 'City Lights', category: 'Urban', rating: 9.5, colorIndex: 1, height: CARD_HEIGHTS[1] },
  { id: '3', title: 'Ocean Waves', category: 'Nature', rating: 9.1, colorIndex: 2, height: CARD_HEIGHTS[2] },
  { id: '4', title: 'Abstract Art', category: 'Art', rating: 9.0, colorIndex: 3, height: CARD_HEIGHTS[3] },
  { id: '5', title: 'Galaxy View', category: 'Space', rating: 8.9, colorIndex: 4, height: CARD_HEIGHTS[4] },
  { id: '6', title: 'Forest Path', category: 'Nature', rating: 8.8, colorIndex: 5, height: CARD_HEIGHTS[5] },
  { id: '7', title: 'Neon Dreams', category: 'Abstract', rating: 9.2, colorIndex: 0, height: CARD_HEIGHTS[6] },
  { id: '8', title: 'Desert Dunes', category: 'Nature', rating: 8.7, colorIndex: 1, height: CARD_HEIGHTS[7] },
  { id: '9', title: 'Aurora Borealis', category: 'Nature', rating: 9.4, colorIndex: 2, height: CARD_HEIGHTS[0] },
  { id: '10', title: 'Tokyo Night', category: 'Urban', rating: 9.1, colorIndex: 3, height: CARD_HEIGHTS[1] },
  { id: '11', title: 'Waterfall', category: 'Nature', rating: 8.6, colorIndex: 4, height: CARD_HEIGHTS[2] },
  { id: '12', title: 'Minimal Lines', category: 'Minimal', rating: 8.5, colorIndex: 5, height: CARD_HEIGHTS[3] },
];

// Stats bar component
const StatsBar = memo(function StatsBar() {
  return (
    <View style={styles.statsBar}>
      <View style={styles.statItem}>
        <ThemedText style={styles.statValue}>{favoritesData.length}</ThemedText>
        <ThemedText style={styles.statLabel}>Wallpapers</ThemedText>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <ThemedText style={styles.statValue}>6</ThemedText>
        <ThemedText style={styles.statLabel}>Categories</ThemedText>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <ThemedText style={styles.statValue}>4K</ThemedText>
        <ThemedText style={styles.statLabel}>Quality</ThemedText>
      </View>
    </View>
  );
});

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();

  const renderItem = useCallback(({ item }: { item: FavoriteItem }) => (
    <FavoriteCard item={item} />
  ), []);

  const keyExtractor = useCallback((item: FavoriteItem) => item.id, []);

  // Override item layout for masonry - provides height for each item
  const overrideItemLayout = useCallback((layout: { size?: number }, item: FavoriteItem) => {
    // Total height = image height + card info height (approx 70px)
    layout.size = item.height + 70;
  }, []);

  const ListHeaderComponent = useCallback(() => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Ionicons name="heart" size={28} color="#EC4899" />
          </View>
          <View>
            <ThemedText type="title" style={styles.headerTitle}>Favorites</ThemedText>
            <ThemedText style={styles.headerSubtitle}>{favoritesData.length} wallpapers saved</ThemedText>
          </View>
        </View>
      </View>

      {/* Stats Bar */}
      <StatsBar />
    </>
  ), []);

  return (
    <ThemedView style={styles.container}>
      {/* FlashList v2 with masonry layout for Pinterest-like wallpaper grid */}
      <FlashList
        data={favoritesData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        masonry
        optimizeItemArrangement
        estimatedItemSize={200}
        overrideItemLayout={overrideItemLayout}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: 120,
          paddingHorizontal: 16,
        }}
        ListHeaderComponent={ListHeaderComponent}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F19',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(236, 72, 153, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(30, 30, 45, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
  },
  favoriteCard: {
    flex: 1,
    margin: 6,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(30, 30, 45, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  cardImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    padding: 12,
    backgroundColor: 'rgba(30, 30, 45, 0.95)',
  },
  cardCategory: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  ratingText: {
    color: '#FBBF24',
    fontSize: 12,
    fontWeight: '600',
  },
});
