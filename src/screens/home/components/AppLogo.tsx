import { Text } from '@/src/components/ui';
import { Theme } from '@constants/theme';
import React from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';

interface AppLogoProps {
    size?: 'small' | 'medium' | 'large';
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = 'medium' }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const fontSize = size === 'small' ? 20 : size === 'large' ? 32 : 26;

    return (
        <View style={styles.container}>
            <Text weight="bold" style={[styles.logo, { fontSize }]}>
                <Text weight="bold" style={styles.logoFilmy}>Filmy</Text>
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
        letterSpacing: -0.5,
    },
    logoFilmy: {
        color: Theme.colors.primary.main,
    },
});

export default AppLogo;
