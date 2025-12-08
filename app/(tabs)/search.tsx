import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import React, { memo, useCallback, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SearchItem {
  id: string;
  label: string;
}

const recentSearches: SearchItem[] = [
  { id: 'r1', label: 'Nature wallpapers' },
  { id: 'r2', label: 'Abstract' },
  { id: 'r3', label: 'Dark mode' },
  { id: 'r4', label: 'Minimal' },
];

const trendingSearches: SearchItem[] = [
  { id: 't1', label: 'Mountains' },
  { id: 't2', label: 'Space' },
  { id: 't3', label: 'Neon' },
  { id: 't4', label: 'Ocean' },
  { id: 't5', label: 'Sunset' },
  { id: 't6', label: 'City' },
];

// Category colors
const CATEGORY_COLORS = ['#8B5CF6', '#EC4899', '#3B82F6', '#EF4444', '#F59E0B', '#10B981'];

const SearchChip = memo(function SearchChip({ label, onPress }: { label: string; onPress: () => void }) {
  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7} style={styles.chip}>
      <ThemedText style={styles.chipText}>{label}</ThemedText>
    </TouchableOpacity>
  );
});

const CategoryCard = memo(function CategoryCard({ name, color }: { name: string; color: string }) {
  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  return (
    <TouchableOpacity
      style={[styles.categoryCard, { backgroundColor: color }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <ThemedText style={styles.categoryText}>{name}</ThemedText>
    </TouchableOpacity>
  );
});

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = useCallback(() => {
    setSearchQuery('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  const setSearch = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const categories = ['Nature', 'Abstract', 'Space', 'Urban', 'Minimal', 'Art'];

  const renderChip = useCallback(({ item }: { item: SearchItem }) => (
    <SearchChip label={item.label} onPress={() => setSearch(item.label)} />
  ), [setSearch]);

  const keyExtractor = useCallback((item: SearchItem) => item.id, []);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>Search</ThemedText>
          <ThemedText style={styles.headerSubtitle}>Find your perfect wallpaper</ThemedText>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, isFocused && styles.searchContainerFocused]}>
          <Ionicons 
            name="search" 
            size={20} 
            color={isFocused ? '#8B5CF6' : 'rgba(255, 255, 255, 0.5)'} 
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search wallpapers..."
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClear}>
              <Ionicons name="close" size={20} color="rgba(255, 255, 255, 0.5)" />
            </TouchableOpacity>
          )}
        </View>

        {/* Recent Searches */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time-outline" size={18} color="rgba(255, 255, 255, 0.6)" />
            <ThemedText type="subtitle" style={styles.sectionTitle}>Recent</ThemedText>
          </View>
          <View style={styles.flashListContainer}>
            <FlashList
              horizontal
              data={recentSearches}
              renderItem={renderChip}
              keyExtractor={keyExtractor}
              estimatedItemSize={120}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
            />
          </View>
        </View>

        {/* Trending Searches */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="trending-up" size={18} color="#EC4899" />
            <ThemedText type="subtitle" style={styles.sectionTitle}>Trending</ThemedText>
          </View>
          <View style={styles.flashListContainer}>
            <FlashList
              horizontal
              data={trendingSearches}
              renderItem={renderChip}
              keyExtractor={keyExtractor}
              estimatedItemSize={100}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
            />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Browse by Category</ThemedText>
          <View style={styles.categoryGrid}>
            {categories.map((cat, index) => (
              <CategoryCard key={cat} name={cat} color={CATEGORY_COLORS[index]} />
            ))}
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
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    height: 56,
    borderRadius: 20,
    backgroundColor: 'rgba(30, 30, 45, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    gap: 12,
  },
  searchContainerFocused: {
    borderColor: 'rgba(139, 92, 246, 0.5)',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  section: {
    marginTop: 32,
    paddingLeft: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
  },
  flashListContainer: {
    height: 44,
  },
  chip: {
    backgroundColor: 'rgba(30, 30, 45, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    marginRight: 10,
  },
  chipText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
    paddingRight: 20,
  },
  categoryCard: {
    width: '46%',
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
