import type { Tag } from '@services/api/tags.service';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import TagCard from './TagCard';

interface TagsGridProps {
    tags: Tag[];
    onTagPress?: (tag: Tag) => void;
}

/**
 * 2-column grid of tag cards — up to 8 tags shown.
 */
const TagsGrid = memo(function TagsGrid({ tags, onTagPress }: TagsGridProps) {
    const visible = tags.slice(0, 8);

    // Build rows of 2
    const rows: [Tag, Tag | null][] = [];
    for (let i = 0; i < visible.length; i += 2) {
        rows.push([visible[i], visible[i + 1] ?? null]);
    }

    return (
        <View style={styles.container}>
            {rows.map((row, i) => (
                <View key={i} style={styles.row}>
                    <TagCard tag={row[0]} onPress={onTagPress} />
                    {row[1] ? (
                        <TagCard tag={row[1]} onPress={onTagPress} />
                    ) : (
                        <View style={styles.empty} />
                    )}
                </View>
            ))}
        </View>
    );
});

export default TagsGrid;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        gap: 10,
    },
    row: {
        flexDirection: 'row',
        gap: 10,
    },
    empty: {
        flex: 1,
    },
});
