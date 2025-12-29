import { Text } from '@/src/components/ui';
import { Screen } from '@components/layout/Screen';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function MenuScreen() {
    return (
        <Screen>
            <View style={styles.container}>
                <Text weight="bold" style={styles.title}>Menu Screen</Text>
                <Text style={styles.subtitle}>Profile and settings will be here</Text>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
});
