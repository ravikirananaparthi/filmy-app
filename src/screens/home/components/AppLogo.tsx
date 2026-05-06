import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface AppLogoProps {
    size?: 'small' | 'medium' | 'large';
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = 'medium' }) => {
    const fontSize = size === 'small' ? 22 : size === 'large' ? 36 : 28;

    return (
        <View style={styles.container}>
            <Text style={[styles.logo, { fontSize }]}>filmy</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        fontFamily: 'DancingScript_700Bold',
        color: '#ffffff',
        letterSpacing: 0.5,
    },
});

export default AppLogo;
