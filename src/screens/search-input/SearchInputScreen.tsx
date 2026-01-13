import type { Actress } from '@/src/types/actress.types';
import useLike from '@hooks/useLike';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Keyboard,
    StatusBar,
    StyleSheet,
    Text,
    View,
    useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
    AutocompleteSuggestions,
    RecentSearches,
    SearchHeader,
    SearchResults,
} from './components';
import { flattenSearchPages, useUnifiedSearch } from './hooks/useActressSearch';
import { useAutocomplete, type AutocompleteSuggestion } from './hooks/useAutocomplete';

const RECENT_SEARCHES_KEY = '@filmy_recent_searches';
const MAX_RECENT_SEARCHES = 10;
const AUTOCOMPLETE_DEBOUNCE = 200;

/**
 * Search Screen with autocomplete suggestions + inline results
 * Flow:
 * 1. User types → show autocomplete suggestions
 * 2. User taps suggestion or submits → trigger full search
 * 3. Show search results with MasonryGrid
 */
export default function SearchInputScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const insets = useSafeAreaInsets();
    const inputRef = useRef<any>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [submittedQuery, setSubmittedQuery] = useState('');
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [showResults, setShowResults] = useState(false);

    const { toggleLike } = useLike();
    const backgroundColor = isDark ? '#000000' : '#FFFFFF';
    const secondaryTextColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';

    // Autocomplete suggestions (while typing)
    const { data: suggestions, isLoading: suggestionsLoading } = useAutocomplete(
        debouncedQuery,
        { limit: 8, enabled: !showResults }
    );

    // Unified search (after submit)
    const {
        data: searchData,
        isLoading: searchLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useUnifiedSearch(submittedQuery);

    // Flatten search results
    const { actresses, images } = useMemo(() => flattenSearchPages(searchData), [searchData]);

    // Debounce for autocomplete
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (query.trim().length >= 2) {
            debounceRef.current = setTimeout(() => {
                setDebouncedQuery(query.trim());
            }, AUTOCOMPLETE_DEBOUNCE);
        } else {
            setDebouncedQuery('');
        }

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query]);

    // Load recent searches on mount
    useEffect(() => {
        loadRecentSearches();
    }, []);

    // Auto-focus input on mount
    useEffect(() => {
        const timer = setTimeout(() => inputRef.current?.focus(), 100);
        return () => clearTimeout(timer);
    }, []);

    // ===== Storage Functions =====
    const loadRecentSearches = async () => {
        try {
            const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
            if (stored) setRecentSearches(JSON.parse(stored));
        } catch (error) {
            console.error('Failed to load recent searches:', error);
        }
    };

    const saveRecentSearch = useCallback(async (searchQuery: string) => {
        try {
            const trimmed = searchQuery.trim();
            if (!trimmed) return;

            setRecentSearches((prev) => {
                const updated = [trimmed, ...prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(
                    0,
                    MAX_RECENT_SEARCHES
                );
                AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
                return updated;
            });
        } catch (error) {
            console.error('Failed to save recent search:', error);
        }
    }, []);

    const clearRecentSearches = useCallback(async () => {
        try {
            setRecentSearches([]);
            await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
        } catch (error) {
            console.error('Failed to clear recent searches:', error);
        }
    }, []);

    const removeRecentSearch = useCallback(async (searchToRemove: string) => {
        try {
            setRecentSearches((prev) => {
                const updated = prev.filter((s) => s !== searchToRemove);
                AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
                return updated;
            });
        } catch (error) {
            console.error('Failed to remove recent search:', error);
        }
    }, []);

    // ===== Handlers =====
    const handleBack = useCallback(() => {
        Keyboard.dismiss();
        router.back();
    }, []);

    const handleClear = useCallback(() => {
        setQuery('');
        setDebouncedQuery('');
        setSubmittedQuery('');
        setShowResults(false);
        inputRef.current?.focus();
    }, []);

    const handleQueryChange = useCallback((text: string) => {
        setQuery(text);
        if (showResults) {
            setShowResults(false);
            setSubmittedQuery('');
        }
    }, [showResults]);

    const handleSubmit = useCallback(() => {
        const trimmed = query.trim();
        if (!trimmed) return;

        Keyboard.dismiss();
        saveRecentSearch(trimmed);
        setSubmittedQuery(trimmed);
        setShowResults(true);
    }, [query, saveRecentSearch]);

    const handleRecentSearchPress = useCallback((search: string) => {
        setQuery(search);
        saveRecentSearch(search);
        setSubmittedQuery(search);
        setShowResults(true);
        Keyboard.dismiss();
    }, [saveRecentSearch]);

    // When tapping a suggestion, search for that term
    const handleSuggestionPress = useCallback((suggestion: AutocompleteSuggestion) => {
        Keyboard.dismiss();
        setQuery(suggestion.name);
        saveRecentSearch(suggestion.name);
        setSubmittedQuery(suggestion.name);
        setShowResults(true);
    }, [saveRecentSearch]);

    const handleActressPress = useCallback((actress: Actress) => {
        router.push(`/actress/${actress.id}` as any);
    }, []);

    const handleImagePress = useCallback((imageId: string) => {
        router.push(`/image/${imageId}?searchQuery=${encodeURIComponent(submittedQuery)}`);
    }, [submittedQuery]);

    const handleLike = useCallback((imageId: string) => {
        toggleLike(imageId);
    }, [toggleLike]);

    const handleEndReached = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    // ===== Render Logic =====
    const hasQuery = query.trim().length >= 2;
    const hasSuggestions = suggestions && suggestions.length > 0;
    const isLoading = suggestionsLoading || searchLoading;

    return (
        <View style={[styles.container, { backgroundColor, paddingTop: insets.top }]}>
            <StatusBar
                animated={true}
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundColor}
            />

            <SearchHeader
                ref={inputRef}
                query={query}
                isLoading={isLoading}
                onQueryChange={handleQueryChange}
                onSubmit={handleSubmit}
                onClear={handleClear}
                onBack={handleBack}
            />

            {showResults && submittedQuery ? (
                <SearchResults
                    query={submittedQuery}
                    actresses={actresses}
                    images={images}
                    isLoading={searchLoading}
                    isFetchingMore={isFetchingNextPage}
                    onActressPress={handleActressPress}
                    onImagePress={handleImagePress}
                    onLike={handleLike}
                    onEndReached={handleEndReached}
                />
            ) : hasQuery && hasSuggestions ? (
                <AutocompleteSuggestions
                    suggestions={suggestions}
                    onSuggestionPress={handleSuggestionPress}
                />
            ) : hasQuery && suggestionsLoading ? (
                <View style={styles.loadingState}>
                    <ActivityIndicator size="small" color={secondaryTextColor} />
                    <Text style={[styles.loadingText, { color: secondaryTextColor }]}>Searching...</Text>
                </View>
            ) : (
                <RecentSearches
                    searches={recentSearches}
                    onSearchPress={handleRecentSearchPress}
                    onRemove={removeRecentSearch}
                    onClearAll={clearRecentSearches}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingState: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 60,
        gap: 12,
    },
    loadingText: {
        fontSize: 14,
    },
});
