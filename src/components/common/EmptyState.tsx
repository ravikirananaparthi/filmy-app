import { Text } from '@/src/components/ui';
import { Theme } from '@constants/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface EmptyStateProps {
    message?: string;
    icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    message = 'No items found',
    icon
}) => {
    return (
        <View style={styles.container}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={styles.message}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    iconContainer: {
        marginBottom: 16,
    },
    message: {
        fontSize: 16,
        color: Theme.colors.text.secondary,
        textAlign: 'center',
    },
});
