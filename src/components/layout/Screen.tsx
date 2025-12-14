import { Theme } from '@constants/theme';
import React from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenProps {
    children: React.ReactNode;
    useSafeArea?: boolean;
}

export const Screen: React.FC<ScreenProps> = ({
    children,
    useSafeArea = true
}) => {
    const colorScheme = useColorScheme();
    const backgroundColor = colorScheme === 'dark'
        ? Theme.colors.background.dark
        : Theme.colors.background.light;

    const Container = useSafeArea ? SafeAreaView : View;

    return (
        <Container style={[styles.container, { backgroundColor }]}>
            {children}
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
