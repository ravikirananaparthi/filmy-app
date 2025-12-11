import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AnimatedHeader } from '@/components/ui/animated-header';
import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { memo, useCallback, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useMotionify } from 'react-native-motionify';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SearchItem { id: string; label: string; }

const recentSearches: SearchItem[] = [
  { id: 'r1', label: 'Nature' }, { id: 'r2', label: 'Abstract' }, { id: 'r3', label: 'Dark mode' }, { id: 'r4', label: 'Minimal' },
];

const trendingSearches: SearchItem[] = [
  { id: 't1', label: 'Mountains' }, { id: 't2', label: 'Space' }, { id: 't3', label: 'Neon' }, { id: 't4', label: 'Ocean' }, { id: 't5', label: 'Sunset' },
];

const CATEGORY_COLORS = [Theme.palette.primary, Theme.palette.accent, Theme.palette.primaryDark, Theme.colors.status.error, Theme.colors.status.warning, Theme.palette.primaryLight];

const SearchChip = memo(function SearchChip({ label, onPress }: { label: string; onPress: () => void }) {
  const handlePress = useCallback(() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }, [onPress]);
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7} style={styles.chip}>
      <ThemedText style={styles.chipText}>{label}</ThemedText>
    </TouchableOpacity>
  );
});

const CategoryCard = memo(function CategoryCard({ name, color }: { name: string; color: string }) {
  return (
    <TouchableOpacity style={[styles.categoryCard, { backgroundColor: color }]} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} activeOpacity={0.8}>
      <ThemedText style={styles.categoryText}>{name}</ThemedText>
    </TouchableOpacity>
  );
});

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { onScroll } = useMotionify();

  const setSearch = useCallback((text: string) => setSearchQuery(text), []);
  const renderChip = useCallback(({ item }: { item: SearchItem }) => <SearchChip label={item.label} onPress={() => setSearch(item.label)} />, [setSearch]);
  const keyExtractor = useCallback((item: SearchItem) => item.id, []);
  const categories = ['Nature', 'Abstract', 'Space', 'Urban', 'Minimal', 'Art'];

  return (
    <ThemedView style={styles.container}>
      <AnimatedHeader title="🔍 Search" subtitle="Find your perfect wallpaper" />
      <ScrollView onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ paddingTop: 100 + insets.top, paddingBottom: 120 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={[styles.searchContainer, isFocused && styles.searchContainerFocused]}>
          <Ionicons name="search" size={20} color={isFocused ? Theme.palette.primary : Theme.colors.text.tertiary} />
          <TextInput style={styles.searchInput} placeholder="Search wallpapers..." placeholderTextColor={Theme.colors.text.muted} value={searchQuery} onChangeText={setSearchQuery} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} />
          {searchQuery.length > 0 && <TouchableOpacity onPress={() => setSearchQuery('')}><Ionicons name="close" size={20} color={Theme.colors.text.tertiary} /></TouchableOpacity>}
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}><Ionicons name="time-outline" size={18} color={Theme.colors.text.secondary} /><ThemedText type="subtitle" style={styles.sectionTitle}>Recent</ThemedText></View>
          <FlatList horizontal data={recentSearches} renderItem={renderChip} keyExtractor={keyExtractor} showsHorizontalScrollIndicator={false} />
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}><Ionicons name="trending-up" size={18} color={Theme.palette.accent} /><ThemedText type="subtitle" style={styles.sectionTitle}>Trending</ThemedText></View>
          <FlatList horizontal data={trendingSearches} renderItem={renderChip} keyExtractor={keyExtractor} showsHorizontalScrollIndicator={false} />
        </View>
        <View style={styles.section}><ThemedText type="subtitle" style={styles.sectionTitle}>Categories</ThemedText><View style={styles.categoryGrid}>{categories.map((cat, i) => <CategoryCard key={cat} name={cat} color={CATEGORY_COLORS[i]} />)}</View></View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background.dark },
  searchContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, paddingHorizontal: 16, height: 56, borderRadius: 20, backgroundColor: Theme.colors.background.surface.dark, borderWidth: 1, borderColor: `${Theme.palette.primary}33`, gap: 12 },
  searchContainerFocused: { borderColor: `${Theme.palette.primary}80` },
  searchInput: { flex: 1, fontSize: 16, color: Theme.colors.text.primary },
  section: { marginTop: 32, paddingLeft: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  sectionTitle: { color: Theme.colors.text.primary },
  chip: { backgroundColor: Theme.colors.background.surface.dark, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: `${Theme.palette.primary}33`, marginRight: 10 },
  chipText: { color: Theme.colors.text.secondary, fontSize: 14 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8, paddingRight: 20 },
  categoryCard: { width: '46%', height: 80, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  categoryText: { color: Theme.colors.text.primary, fontSize: 16, fontWeight: '600' },
});
