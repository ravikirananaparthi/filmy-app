import { Theme } from '@constants/theme';
import React from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';

interface AppLogoProps {
    size?: 'small' | 'medium' | 'large';
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = 'medium' }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const fontSize = size === 'small' ? 20 : size === 'large' ? 32 : 26;

    return (
        <View style={styles.container}>
            <Text style={[styles.logo, { fontSize }]}>
                <Text style={styles.logoFilmy}>Filmy</Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    logoFilmy: {
        color: Theme.colors.primary.main,
    },
});

export default AppLogo;
