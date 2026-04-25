import type { Tag } from '@services/api/tags.service';
import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Category → gradient palette
const CATEGORY_GRADIENTS: Record<string, readonly [string, string]> = {
    mood:       ['#FF6B9D', '#C44569'],
    style:      ['#A259FF', '#7B3DC9'],
    genre:      ['#14B8A6', '#0D9488'],
    action:     ['#F97316', '#EA580C'],
    appearance: ['#F59E0B', '#D97706'],
    emotion:    ['#EC4899', '#BE185D'],
    setting:    ['#3B82F6', '#1D4ED8'],
    attire:     ['#10B981', '#047857'],
    default:    ['#6B7280', '#374151'],
};

const getGradient = (category: string): readonly [string, string] =>
    CATEGORY_GRADIENTS[category?.toLowerCase()] ?? CATEGORY_GRADIENTS.default;

interface TagCardProps {
    tag: Tag;
    onPress?: (tag: Tag) => void;
}

const TagCard = memo(function TagCard({ tag, onPress }: TagCardProps) {
    const gradient = getGradient(tag.category);

    return (
        <Pressable
            style={({ pressed }) => [styles.container, pressed && styles.pressed]}
            onPress={() => onPress?.(tag)}
        >
            <LinearGradient colors={gradient as any} style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Text style={styles.name} numberOfLines={1}>{tag.name}</Text>
                {tag.usage_count > 0 && (
                    <Text style={styles.count}>
                        {tag.usage_count > 999
                            ? `${(tag.usage_count / 1000).toFixed(1)}k`
                            : tag.usage_count}{' '}pins
                    </Text>
                )}
            </LinearGradient>
        </Pressable>
    );
});

export default TagCard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 14,
        overflow: 'hidden',
        height: 80,
    },
    pressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }],
    },
    gradient: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 12,
    },
    name: {
        fontSize: 15,
        fontWeight: '700',
        color: '#fff',
        fontFamily: 'GoogleSansFlex_700Bold',
    },
    count: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.75)',
        marginTop: 2,
        fontFamily: 'GoogleSansFlex_400Regular',
    },
});
