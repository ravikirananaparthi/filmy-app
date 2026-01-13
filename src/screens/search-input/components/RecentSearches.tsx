import { FontFamily } from '@/constants/theme';
import { Text } from '@/src/components/ui';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    View,
    useColorScheme,
} from 'react-native';

interface RecentSearchesProps {
    searches: string[];
    onSearchPress: (search: string) => void;
    onRemove: (search: string) => void;
    onClearAll: () => void;
}

/**
 * Recent searches list component
 */
export function RecentSearches({
    searches,
    onSearchPress,
    onRemove,
    onClearAll,
}: RecentSearchesProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const textColor = isDark ? '#FFFFFF' : '#000000';
    const borderColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
    const secondaryTextColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';

    if (searches.length === 0) {
        return (
            <View style={styles.emptyState}>
                <Ionicons name="search" size={48} color={secondaryTextColor} />
                <Text style={[styles.emptyText, { color: secondaryTextColor }]}>
                    Search for your favorite actresses
                </Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.recentSection}>
                <View style={styles.recentHeader}>
                    <Text style={[styles.recentTitle, { color: textColor }]}>Recent Searches</Text>
                    <Pressable onPress={onClearAll}>
                        <Text style={styles.clearAllText}>Clear All</Text>
                    </Pressable>
                </View>

                {searches.map((search, index) => (
                    <Pressable
                        key={`${search}-${index}`}
                        style={[styles.recentItem, { borderBottomColor: borderColor }]}
                        onPress={() => onSearchPress(search)}
                    >
                        <Ionicons name="time-outline" size={18} color={secondaryTextColor} />
                        <Text style={[styles.recentText, { color: textColor }]} numberOfLines={1}>
                            {search}
                        </Text>
                        <Pressable
                            onPress={() => onRemove(search)}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons name="close" size={18} color={secondaryTextColor} />
                        </Pressable>
                    </Pressable>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    recentSection: {
        paddingTop: 16,
    },
    recentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    recentTitle: {
        fontSize: 16,
        fontFamily: FontFamily.semibold,
    },
    clearAllText: {
        fontSize: 14,
        fontFamily: FontFamily.medium,
        color: '#007AFF',
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
        gap: 12,
    },
    recentText: {
        flex: 1,
        fontSize: 15,
        fontFamily: FontFamily.regular,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
        gap: 16,
    },
    emptyText: {
        fontSize: 16,
        fontFamily: FontFamily.regular,
        textAlign: 'center',
        paddingHorizontal: 32,
    },
});
