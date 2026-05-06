import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface AppLogoProps {
    size?: 'small' | 'medium' | 'large';
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = 'medium' }) => {
    const fontSize = size === 'small' ? 26 : size === 'large' ? 40 : 32;

    return (
        <View style={styles.container}>
            <Text style={[styles.logo, { fontSize }]}>
                FILMY
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        fontFamily: 'BebasNeue_400Regular',
        color: '#ffffff',
        letterSpacing: 4,
    },
});

export default AppLogo;
