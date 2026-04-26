import { apiClient } from '@services/api/client';
import { API_ENDPOINTS } from '@services/api/endpoints';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Keyboard,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    useColorScheme,
} from 'react-native';

interface Tag {
    id: string;
    name: string;
}

interface Props {
    selectedTags: string[];           // current tag names for this image
    onChange: (tags: string[]) => void;
    onApplyToAll?: () => void;        // only passed for image index 0
}

function usePopularTags() {
    return useQuery<Tag[]>({
        queryKey: ['popularTags'],
        queryFn: async () => {
            const res = await apiClient.get<{ success: boolean; data: Tag[] }>(
                API_ENDPOINTS.TAGS.POPULAR
            );
            return res.data.data ?? [];
        },
        staleTime: 10 * 60 * 1000,
    });
}

function useTagSearch(query: string) {
    return useQuery<Tag[]>({
        queryKey: ['tagSearch', query],
        queryFn: async () => {
            if (!query.trim()) return [];
            const res = await apiClient.get<{ success: boolean; data: Tag[] }>(
                `${API_ENDPOINTS.TAGS.SEARCH}?q=${encodeURIComponent(query)}`
            );
            return res.data.data ?? [];
        },
        enabled: query.trim().length > 0,
        staleTime: 30_000,
    });
}

export function TagSelector({ selectedTags, onChange, onApplyToAll }: Props) {
    const isDark = useColorScheme() === 'dark';
    const [inputText, setInputText] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<TextInput>(null);

    const { data: popular = [], isLoading: popularLoading } = usePopularTags();
    const { data: suggestions = [] } = useTagSearch(inputText);

    const toggleTag = useCallback((name: string) => {
        if (selectedTags.includes(name)) {
            onChange(selectedTags.filter((t) => t !== name));
        } else if (selectedTags.length < 10) {
            onChange([...selectedTags, name]);
        }
    }, [selectedTags, onChange]);

    const addCustomTag = useCallback((name: string) => {
        const clean = name.trim().toLowerCase();
        if (!clean || selectedTags.includes(clean) || selectedTags.length >= 10) return;
        onChange([...selectedTags, clean]);
        setInputText('');
        setShowSuggestions(false);
    }, [selectedTags, onChange]);

    const removeTag = useCallback((name: string) => {
        onChange(selectedTags.filter((t) => t !== name));
    }, [selectedTags, onChange]);

    const textColor = isDark ? '#fff' : '#111';
    const subColor = isDark ? '#999' : '#666';
    const surface = isDark ? '#1E1E1E' : '#F5F5F5';
    const selectedBg = '#7C3AED';
    const border = isDark ? '#333' : '#E0E0E0';

    return (
        <View style={styles.container}>
            {/* Selected tags row */}
            {selectedTags.length > 0 && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.selectedRow}
                    contentContainerStyle={styles.selectedRowContent}
                >
                    {selectedTags.map((tag) => (
                        <Pressable
                            key={tag}
                            style={styles.selectedChip}
                            onPress={() => removeTag(tag)}
                        >
                            <Text style={styles.selectedChipText}>#{tag}</Text>
                            <Text style={styles.removeX}> ✕</Text>
                        </Pressable>
                    ))}
                </ScrollView>
            )}

            {/* Apply to all button (only for first image) */}
            {onApplyToAll && selectedTags.length > 0 && (
                <Pressable
                    style={({ pressed }) => [
                        styles.applyAllBtn,
                        { borderColor: selectedBg, opacity: pressed ? 0.7 : 1 },
                    ]}
                    onPress={onApplyToAll}
                >
                    <Text style={[styles.applyAllText, { color: selectedBg }]}>
                        Apply tags to all images
                    </Text>
                </Pressable>
            )}

            {/* Text input for custom / searched tags */}
            <View style={[styles.inputRow, { borderColor: border, backgroundColor: surface }]}>
                <TextInput
                    ref={inputRef}
                    style={[styles.input, { color: textColor }]}
                    placeholder="Search or add a tag…"
                    placeholderTextColor={subColor}
                    value={inputText}
                    onChangeText={(t) => {
                        setInputText(t);
                        setShowSuggestions(t.trim().length > 0);
                    }}
                    onSubmitEditing={() => {
                        if (inputText.trim()) addCustomTag(inputText);
                    }}
                    returnKeyType="done"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                {inputText.trim().length > 0 && (
                    <Pressable
                        style={styles.addBtn}
                        onPress={() => addCustomTag(inputText)}
                    >
                        <Text style={styles.addBtnText}>Add</Text>
                    </Pressable>
                )}
            </View>

            {/* Autocomplete suggestions */}
            {showSuggestions && suggestions.length > 0 && (
                <View style={[styles.suggestions, { backgroundColor: isDark ? '#252525' : '#fff', borderColor: border }]}>
                    {suggestions.slice(0, 5).map((tag) => (
                        <Pressable
                            key={tag.id}
                            style={({ pressed }) => [
                                styles.suggestionItem,
                                pressed && { backgroundColor: isDark ? '#333' : '#f0f0f0' },
                            ]}
                            onPress={() => {
                                addCustomTag(tag.name);
                                Keyboard.dismiss();
                            }}
                        >
                            <Text style={[styles.suggestionText, { color: textColor }]}>
                                #{tag.name}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            )}

            {/* Popular tag chips */}
            <Text style={[styles.sectionLabel, { color: subColor }]}>Popular tags</Text>
            {popularLoading ? (
                <ActivityIndicator size="small" color={selectedBg} style={{ marginTop: 8 }} />
            ) : (
                <View style={styles.chipsWrap}>
                    {popular.slice(0, 20).map((tag) => {
                        const active = selectedTags.includes(tag.name);
                        return (
                            <Pressable
                                key={tag.id}
                                style={[
                                    styles.chip,
                                    {
                                        backgroundColor: active ? selectedBg : surface,
                                        borderColor: active ? selectedBg : border,
                                    },
                                ]}
                                onPress={() => toggleTag(tag.name)}
                            >
                                <Text
                                    style={[
                                        styles.chipText,
                                        { color: active ? '#fff' : textColor },
                                    ]}
                                >
                                    #{tag.name}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    selectedRow: {
        marginBottom: 10,
    },
    selectedRowContent: {
        gap: 8,
        paddingRight: 16,
    },
    selectedChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#7C3AED',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    selectedChipText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '500',
    },
    removeX: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 11,
    },
    applyAllBtn: {
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 6,
        marginBottom: 12,
    },
    applyAllText: {
        fontSize: 13,
        fontWeight: '600',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 4,
        height: 44,
    },
    input: {
        flex: 1,
        fontSize: 14,
        height: '100%',
    },
    addBtn: {
        backgroundColor: '#7C3AED',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    addBtnText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    suggestions: {
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 8,
        overflow: 'hidden',
    },
    suggestionItem: {
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    suggestionText: {
        fontSize: 14,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        marginTop: 12,
        marginBottom: 8,
    },
    chipsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        paddingBottom: 16,
    },
    chip: {
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    chipText: {
        fontSize: 13,
    },
});
