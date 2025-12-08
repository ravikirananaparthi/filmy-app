import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AnimatedHeader } from '@/components/ui/animated-header';
import { useScrollContext } from '@/contexts/scroll-context';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import React, { memo, useCallback } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedScrollHandler } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.7;
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
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8} style={[styles.trendingCard, { backgroundColor }]}>
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
];

export default function TrendingScreen() {
  const insets = useSafeAreaInsets();
  const { scrollY } = useScrollContext();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => { scrollY.value = event.contentOffset.y; },
  });

  const renderItem = useCallback(({ item }: { item: TrendingItem }) => <TrendingCard item={item} />, []);
  const keyExtractor = useCallback((item: TrendingItem) => item.id, []);

  return (
    <ThemedView style={styles.container}>
      <AnimatedHeader title="🔥 Trending" subtitle="What's hot right now" scrollY={scrollY} />
      <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16} contentContainerStyle={{ paddingTop: 100 + insets.top, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={styles.flashListContainer}>
          <FlashList horizontal data={trendingData} renderItem={renderItem} keyExtractor={keyExtractor} estimatedItemSize={CARD_WIDTH + 16} showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }} />
        </View>
        <View style={styles.statsSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>This Week</ThemedText>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}><ThemedText style={styles.statValue}>2.4M</ThemedText><ThemedText style={styles.statLabel}>Views</ThemedText></View>
            <View style={styles.statCard}><ThemedText style={styles.statValue}>128K</ThemedText><ThemedText style={styles.statLabel}>Likes</ThemedText></View>
            <View style={styles.statCard}><ThemedText style={styles.statValue}>45K</ThemedText><ThemedText style={styles.statLabel}>Shares</ThemedText></View>
          </View>
        </View>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F19' },
  flashListContainer: { height: 216 },
  trendingCard: { width: CARD_WIDTH, height: 200, borderRadius: 24, overflow: 'hidden', marginRight: 16 },
  trendingCardContent: { flex: 1, padding: 20, justifyContent: 'space-between' },
  rankBadge: { position: 'absolute', top: 16, left: 16, backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  rankText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  playButton: { position: 'absolute', top: '50%', left: '50%', marginLeft: -24, marginTop: -24, width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  cardInfo: { marginTop: 'auto' },
  cardCategory: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  cardTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', marginTop: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  ratingText: { color: '#FBBF24', fontSize: 14, fontWeight: '600' },
  statsSection: { marginTop: 32, paddingHorizontal: 20 },
  sectionTitle: { color: '#FFFFFF', marginBottom: 16 },
  statsGrid: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, height: 100, borderRadius: 20, backgroundColor: 'rgba(30,30,45,0.8)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(139,92,246,0.2)' },
  statValue: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
  statLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4 },
});
