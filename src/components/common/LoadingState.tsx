import { Theme } from '@constants/theme';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface LoadingStateProps {
    size?: 'small' | 'large';
    color?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
    size = 'large',
    color = Theme.palette.primary
}) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={color} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
});
