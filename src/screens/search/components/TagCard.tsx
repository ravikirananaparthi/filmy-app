import type { Tag } from '@services/api/tags.service';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// Category → solid gradient fallback (used when no thumbnail)
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
    const hasThumbnail = !!tag.thumbnailUrl;

    return (
        <Pressable
            style={({ pressed }) => [styles.container, pressed && styles.pressed]}
            onPress={() => onPress?.(tag)}
        >
            <View style={styles.inner}>
                {/* Background: thumbnail or solid gradient */}
                {hasThumbnail ? (
                    <Image
                        source={{ uri: tag.thumbnailUrl! }}
                        style={StyleSheet.absoluteFill}
                        contentFit="cover"
                        recyclingKey={tag.thumbnailUrl!}
                        transition={200}
                    />
                ) : null}

                {/* Gradient overlay — darker when thumbnail present */}
                <LinearGradient
                    colors={
                        hasThumbnail
                            ? ['rgba(0,0,0,0.08)', 'rgba(0,0,0,0.72)']
                            : (gradient as any)
                    }
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />

                {/* Text */}
                <View style={styles.textContent}>
                    <Text style={styles.name} numberOfLines={1}>{tag.name}</Text>
                    {tag.usage_count > 0 && (
                        <Text style={styles.count}>
                            {tag.usage_count > 999
                                ? `${(tag.usage_count / 1000).toFixed(1)}k`
                                : tag.usage_count}{' '}pins
                        </Text>
                    )}
                </View>
            </View>
        </Pressable>
    );
});

export default TagCard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 14,
        overflow: 'hidden',
        height: 90,
    },
    pressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }],
    },
    inner: {
        flex: 1,
        backgroundColor: '#222',  // placeholder while loading
    },
    textContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 11,
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
