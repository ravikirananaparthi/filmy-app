import { Screen } from '@components/layout/Screen';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function FavoritesScreen() {
    return (
        <Screen>
            <View style={styles.container}>
                <Text style={styles.title}>Favorites Screen</Text>
                <Text style={styles.subtitle}>Your favorite images will be shown here</Text>
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
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
});
