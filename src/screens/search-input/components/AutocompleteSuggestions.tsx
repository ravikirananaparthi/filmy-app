import { FontFamily } from '@/constants/theme';
import { Text } from '@/src/components/ui';
import type { AutocompleteSuggestion } from '@/src/screens/search-input/hooks/useAutocomplete';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
    useColorScheme,
} from 'react-native';

interface AutocompleteSuggestionsProps {
    suggestions: AutocompleteSuggestion[];
    onSuggestionPress: (suggestion: AutocompleteSuggestion) => void;
}

/**
 * Autocomplete suggestions list
 * Shows actress/tag suggestions while user is typing
 */
export function AutocompleteSuggestions({
    suggestions,
    onSuggestionPress,
}: AutocompleteSuggestionsProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const textColor = isDark ? '#FFFFFF' : '#000000';
    const borderColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
    const secondaryTextColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';
    const cardBgColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';

    if (suggestions.length === 0) return null;

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.suggestionsSection}>
                {suggestions.map((suggestion, index) => (
                    <Pressable
                        key={`${suggestion.type}-${suggestion.id}-${index}`}
                        style={[styles.suggestionItem, { borderBottomColor: borderColor }]}
                        onPress={() => onSuggestionPress(suggestion)}
                    >
                        {suggestion.type === 'actress' && suggestion.imageUrl ? (
                            <Image
                                source={{ uri: suggestion.imageUrl }}
                                style={styles.suggestionImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={[styles.suggestionIconContainer, { backgroundColor: cardBgColor }]}>
                                <Ionicons
                                    name="pricetag"
                                    size={16}
                                    color={secondaryTextColor}
                                />
                            </View>
                        )}
                        <Text style={[styles.suggestionName, { color: textColor }]} numberOfLines={1}>
                            {suggestion.name}
                        </Text>
                        <Ionicons name="arrow-forward" size={18} color={secondaryTextColor} />
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
    suggestionsSection: {
        paddingTop: 8,
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        gap: 12,
    },
    suggestionImage: {
        width: 44,
        height: 44,
        borderRadius: 8,
        backgroundColor: 'rgba(128,128,128,0.2)',
    },
    suggestionIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    suggestionName: {
        flex: 1,
        fontSize: 15,
        fontFamily: FontFamily.medium,
    },
});
