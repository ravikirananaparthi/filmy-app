import { FontFamily } from '@/constants/theme';
import { TextInput } from '@/src/components/ui';
import { Ionicons } from '@expo/vector-icons';
import React, { forwardRef } from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    View,
    useColorScheme,
} from 'react-native';

interface SearchHeaderProps {
    query: string;
    isLoading: boolean;
    onQueryChange: (text: string) => void;
    onSubmit: () => void;
    onClear: () => void;
    onBack: () => void;
}

/**
 * Search header with input and controls
 */
export const SearchHeader = forwardRef<any, SearchHeaderProps>(
    ({ query, isLoading, onQueryChange, onSubmit, onClear, onBack }, ref) => {
        const colorScheme = useColorScheme();
        const isDark = colorScheme === 'dark';

        const textColor = isDark ? '#FFFFFF' : '#000000';
        const placeholderColor = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
        const borderColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
        const secondaryTextColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';
        const inputBg = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';

        return (
            <View style={[styles.header, { borderBottomColor: borderColor }]}>
                <Pressable
                    onPress={onBack}
                    style={styles.backButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="arrow-back" size={24} color={textColor} />
                </Pressable>

                <View style={[styles.inputContainer, { backgroundColor: inputBg }]}>
                    <Ionicons name="search" size={18} color={placeholderColor} style={styles.searchIcon} />
                    <TextInput
                        ref={ref}
                        style={[styles.input, { color: textColor }]}
                        placeholder="Search actresses..."
                        placeholderTextColor={placeholderColor}
                        value={query}
                        onChangeText={onQueryChange}
                        onSubmitEditing={onSubmit}
                        returnKeyType="search"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {query.length > 0 && (
                        <Pressable onPress={onClear} style={styles.clearButton}>
                            <Ionicons name="close-circle" size={18} color={placeholderColor} />
                        </Pressable>
                    )}
                </View>

                {isLoading && (
                    <ActivityIndicator size="small" color={secondaryTextColor} style={styles.loadingIndicator} />
                )}
            </View>
        );
    }
);

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        gap: 10,
    },
    backButton: {
        padding: 4,
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 40,
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontFamily: FontFamily.regular,
        padding: 0,
    },
    clearButton: {
        padding: 4,
    },
    loadingIndicator: {
        marginLeft: 8,
    },
});
