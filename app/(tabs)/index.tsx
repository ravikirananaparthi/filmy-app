import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FlashList } from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import React, { memo, useCallback } from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_HEIGHT = 80;
const CARD_HEIGHT = 100;

// Color palette for card accents
const ACCENT_COLORS = [
  '#8B5CF6',
  '#EC4899',
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
];

interface ListItemData {
  id: string;
  title: string;
  subtitle: string;
  colorIndex: number;
}

// Memoized list item component for better performance
const ListItem = memo(function ListItem({ item, onPress }: { item: ListItemData; onPress: () => void }) {
  const accentColor = ACCENT_COLORS[item.colorIndex % ACCENT_COLORS.length];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.listItem}
    >
      {/* Left accent bar */}
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

// Generate mock data once
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
      result.push({
        id: `${i}-${index}`,
        title: item.title,
        subtitle: item.subtitle,
        colorIndex: index,
      });
    });
  }
  return result;
};

const MOCK_DATA = generateMockData();

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 100],
      [0, -20],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollY.value,
      [0, 50],
      [1, 0.9],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY }],
      opacity,
    };
  });

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
      <Animated.View
        style={[
          styles.header,
          { paddingTop: insets.top + 16 },
          headerAnimatedStyle,
        ]}
      >
        <View style={styles.headerBackground} />
        <View style={styles.headerContent}>
          <ThemedText type="title" style={styles.headerTitle}>
            🎬 Filmy
          </ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Discover amazing content
          </ThemedText>
        </View>
      </Animated.View>

      {/* FlashList v2 */}
      <FlashList
        data={MOCK_DATA}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={CARD_HEIGHT + 12}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT + insets.top + 24,
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    height: HEADER_HEIGHT + 60,
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
    paddingBottom: 16,
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F0F19',
  },
  headerContent: {
    gap: 4,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
  },
  seeAll: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
  },
  listItem: {
    height: CARD_HEIGHT,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(30, 30, 45, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.15)',
    flexDirection: 'row',
  },
  cardAccent: {
    width: 4,
    height: '100%',
  },
  cardContent: {
    flex: 1,
    padding: 14,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 8,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
  },
});
