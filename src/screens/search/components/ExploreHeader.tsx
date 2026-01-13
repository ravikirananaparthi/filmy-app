import { FontFamily } from '@/constants/theme';
import { Text } from '@/src/components/ui';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Pressable,
    StyleSheet,
    View,
    useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HEADER_HEIGHT = 56;

interface ExploreHeaderProps {
    onSearchPress?: () => void;
}

/**
 * Apple TV-style static header with large title and search icon.
 * Non-collapsing, safe-area aware.
 */
export default function ExploreHeader({ onSearchPress }: ExploreHeaderProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const insets = useSafeAreaInsets();

    const backgroundColor = isDark ? '#000000' : '#FFFFFF';
    const textColor = isDark ? '#FFFFFF' : '#000000';
    const iconColor = isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.85)';

    return (
        <View style={[styles.container, { paddingTop: insets.top, backgroundColor }]}>
            <View style={styles.content}>
                {/* Large Title */}
                <Text
                    style={[
                        styles.title,
                        {
                            color: textColor,
                            fontFamily: FontFamily.bold,
                            fontSize: 30,
                            fontWeight: '700',
                            letterSpacing: -0.5,
                        },
                    ]}
                >
                    Explore
                </Text>


                {/* Search Icon */}
                <Pressable
                    onPress={onSearchPress}
                    style={({ pressed }) => [
                        styles.searchButton,
                        { borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)' },
                        pressed && styles.searchButtonPressed,
                    ]}
                    hitSlop={{ top: 11, bottom: 11, left: 11, right: 11 }}
                >
                    <Ionicons name="search" size={22} color={iconColor} />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    content: {
        height: HEADER_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    title: {
        flex: 1,
    },
    searchButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 22,
        borderWidth: 1.5,
    },
    searchButtonPressed: {
        opacity: 0.7,
    },
});
