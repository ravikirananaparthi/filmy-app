/**
 * CreateFolderCard Component
 * "+" card to create new folder
 */
import { Theme } from '@/constants/theme';
import { Text } from '@/src/components/ui';
import React from 'react';
import { Pressable, StyleSheet, View, useColorScheme } from 'react-native';

interface CreateFolderCardProps {
    onPress: () => void;
}

export const CreateFolderCard: React.FC<CreateFolderCardProps> = ({ onPress }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const cardBg = isDark ? '#2C2C2E' : '#FFFFFF';
    const iconBg = Theme.colors.primary.main;

    return (
        <Pressable
            style={({ pressed }) => [
                styles.container,
                { backgroundColor: cardBg },
                pressed && styles.pressed,
            ]}
            onPress={onPress}
        >
            {/* Plus Icon */}
            <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
                <Text weight="bold" style={styles.plusIcon}>+</Text>
            </View>

            {/* Label */}
            <View style={styles.info}>
                <Text weight="semibold" style={[styles.label, { color: Theme.colors.primary.main }]}>
                    New Folder
                </Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
        margin: 6,
    },
    pressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    iconContainer: {
        aspectRatio: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    plusIcon: {
        fontSize: 40,
        color: '#FFFFFF',
    },
    info: {
        padding: 10,
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
    },
});

export default CreateFolderCard;
