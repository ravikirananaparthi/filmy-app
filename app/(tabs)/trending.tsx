import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import React, { memo, useCallback } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.7;

// Simple color backgrounds
const CARD_COLORS = ['#EC4899', '#8B5CF6', '#3B82F6', '#10B981'];

interface TrendingItem {
  id: string;
  title: string;
  category: string;
  rating: number;
  rank: number;
}

const TrendingCard = memo(function TrendingCard({ item }: { item: TrendingItem }) {
  const backgroundColor = CARD_COLORS[item.rank % CARD_COLORS.length];

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={[styles.trendingCard, { backgroundColor }]}
    >
      <View style={styles.trendingCardContent}>
        <View style={styles.rankBadge}>
          <ThemedText style={styles.rankText}>#{item.rank}</ThemedText>
        </View>
        <View style={styles.playButton}>
          <Ionicons name="play" size={24} color="#FFFFFF" />
        </View>
        <View style={styles.cardInfo}>
          <ThemedText style={styles.cardCategory}>{item.category}</ThemedText>
          <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#FBBF24" />
            <ThemedText style={styles.ratingText}>{item.rating}</ThemedText>
            <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.6)" />
            <ThemedText style={styles.durationText}>2h 15m</ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const trendingData: TrendingItem[] = [
  { id: '1', title: 'The Last Journey', category: 'Action', rating: 9.2, rank: 1 },
  { id: '2', title: 'Midnight Dreams', category: 'Drama', rating: 8.8, rank: 2 },
  { id: '3', title: 'Cosmic Adventure', category: 'Sci-Fi', rating: 9.0, rank: 3 },
  { id: '4', title: 'Love in Paris', category: 'Romance', rating: 8.5, rank: 4 },
  { id: '5', title: 'The Dark Forest', category: 'Horror', rating: 8.7, rank: 5 },
];

const StatCard = memo(function StatCard({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <View style={[styles.statCard, { borderColor: `${color}30` }]}>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </View>
  );
});

export default function TrendingScreen() {
  const insets = useSafeAreaInsets();

  const renderTrendingCard = useCallback(({ item }: { item: TrendingItem }) => (
    <TrendingCard item={item} />
  ), []);

  const keyExtractor = useCallback((item: TrendingItem) => item.id, []);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="trending-up" size={28} color="#EC4899" />
          </View>
          <View>
            <ThemedText type="title" style={styles.headerTitle}>Trending</ThemedText>
            <ThemedText style={styles.headerSubtitle}>What's hot right now</ThemedText>
          </View>
        </View>

        {/* Trending Cards - Horizontal FlashList */}
        <View style={styles.flashListContainer}>
          <FlashList
            horizontal
            data={trendingData}
            renderItem={renderTrendingCard}
            keyExtractor={keyExtractor}
            estimatedItemSize={CARD_WIDTH + 16}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          />
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>This Week</ThemedText>
          <View style={styles.statsGrid}>
            <StatCard value="2.4M" label="Views" color="#8B5CF6" />
            <StatCard value="128K" label="Likes" color="#EC4899" />
            <StatCard value="45K" label="Shares" color="#3B82F6" />
          </View>
        </View>
      </ScrollView>
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
    paddingHorizontal: 20,
    marginBottom: 24,
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
  flashListContainer: {
    height: 216,
  },
  trendingCard: {
    width: CARD_WIDTH,
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    marginRight: 16,
  },
  trendingCardContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  rankBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  rankText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -24,
    marginTop: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    marginTop: 'auto',
  },
  cardCategory: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  ratingText: {
    color: '#FBBF24',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  durationText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  statsSection: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: '#FFFFFF',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    height: 100,
    borderRadius: 20,
    backgroundColor: 'rgba(30, 30, 45, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: 4,
  },
});
