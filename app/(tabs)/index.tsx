import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AnimatedHeader } from '@/components/ui/animated-header';
import { Theme } from '@/constants/theme';
import * as Haptics from 'expo-haptics';
import React, { memo, useCallback } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HEADER_HEIGHT = 100;
const CARD_HEIGHT = 100;

const ACCENT_COLORS = [Theme.palette.primary, Theme.palette.accent, Theme.palette.primaryDark, Theme.palette.primaryLight, Theme.palette.muted, Theme.colors.status.error];

interface ListItemData {
  id: string;
  title: string;
  subtitle: string;
  colorIndex: number;
}

const ListItem = memo(function ListItem({ item, onPress }: { item: ListItemData; onPress: () => void }) {
  const accentColor = ACCENT_COLORS[item.colorIndex % ACCENT_COLORS.length];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.listItem}>
      <View style={[styles.cardAccent, { backgroundColor: accentColor }]} />
      <View style={styles.cardContent}>
        <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
        <ThemedText style={styles.cardSubtitle}>{item.subtitle}</ThemedText>
        <View style={styles.cardMeta}>
          <View style={[styles.badge, { backgroundColor: `${accentColor}30` }]}>
            <ThemedText style={[styles.badgeText, { color: accentColor }]}>New</ThemedText>
          </View>
          <ThemedText style={styles.timestamp}>2 hours ago</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const generateMockData = (): ListItemData[] => {
  const items = [
    { title: 'Welcome to Filmy', subtitle: 'Discover amazing content' },
    { title: 'Trending Movies', subtitle: 'Top picks for you' },
    { title: 'New Releases', subtitle: 'Fresh content just added' },
    { title: 'Popular Series', subtitle: 'Binge-worthy shows' },
    { title: 'Award Winners', subtitle: 'Critically acclaimed' },
    { title: 'Hidden Gems', subtitle: 'Underrated masterpieces' },
    { title: 'Action & Adventure', subtitle: 'Thrilling entertainment' },
    { title: 'Comedy Corner', subtitle: 'Laugh out loud' },
    { title: 'Drama Collection', subtitle: 'Emotional stories' },
    { title: 'Sci-Fi Universe', subtitle: 'Explore the unknown' },
    { title: 'Documentary Hub', subtitle: 'Real stories, real impact' },
    { title: 'Animation World', subtitle: 'For all ages' },
    { title: 'Classic Films', subtitle: 'Timeless masterpieces' },
    { title: 'International Cinema', subtitle: 'Global entertainment' },
    { title: 'Music & Musicals', subtitle: 'Feel the rhythm' },
  ];

  const result: ListItemData[] = [];
  for (let i = 0; i < 3; i++) {
    items.forEach((item, index) => {
      result.push({ id: `${i}-${index}`, title: item.title, subtitle: item.subtitle, colorIndex: index });
    });
  }
  return result;
};

const MOCK_DATA = generateMockData();

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const handleItemPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const renderItem = useCallback(({ item }: { item: ListItemData }) => (
    <ListItem item={item} onPress={handleItemPress} />
  ), [handleItemPress]);

  const keyExtractor = useCallback((item: ListItemData) => item.id, []);

  const ListHeaderComponent = useCallback(() => (
    <View style={styles.sectionHeader}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>For You</ThemedText>
      <TouchableOpacity onPress={handleItemPress}>
        <ThemedText style={styles.seeAll}>See All</ThemedText>
      </TouchableOpacity>
    </View>
  ), [handleItemPress]);

  return (
    <ThemedView style={styles.container}>
      {/* Animated Header */}
      <AnimatedHeader title="🎬 Filmy" subtitle="Discover amazing content" />

      {/* FlatList with motionify onScroll - drives coordinated animations */}
      <FlatList
        data={MOCK_DATA}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: HEADER_HEIGHT + insets.top, paddingBottom: 120 },
        ]}
        ListHeaderComponent={ListHeaderComponent}
        removeClippedSubviews={true}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background.dark },
  scrollContent: { paddingHorizontal: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { color: Theme.colors.text.primary },
  seeAll: { color: Theme.palette.primary, fontSize: 14, fontWeight: '600' },
  listItem: { height: CARD_HEIGHT, borderRadius: 16, marginBottom: 12, overflow: 'hidden', backgroundColor: Theme.colors.background.surface.dark, borderWidth: 1, borderColor: `${Theme.palette.primary}25`, flexDirection: 'row' },
  cardAccent: { width: 4, height: '100%' },
  cardContent: { flex: 1, padding: 14, justifyContent: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '600', color: Theme.colors.text.primary, marginBottom: 4 },
  cardSubtitle: { fontSize: 13, color: Theme.colors.text.secondary, marginBottom: 8 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  badgeText: { fontSize: 10, fontWeight: '600' },
  timestamp: { fontSize: 11, color: Theme.colors.text.muted },
});
