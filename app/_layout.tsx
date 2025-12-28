// MUST BE FIRST - Initialize Reactotron in development
if (__DEV__) {
    require('../src/config/reactotron');
}

import { Theme } from '@/constants/theme';
import { ApiProvider } from '@/src/providers/ApiProvider';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

// Enable native screens for better performance
enableScreens();


export default function RootLayout() {
    const colorScheme = useColorScheme();

    const backgroundColor = colorScheme === 'dark'
        ? Theme.colors.background.dark
        : Theme.colors.background.light;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <ApiProvider>
                    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : undefined}>
                        <View style={{ flex: 1, backgroundColor }}>
                            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
                            <Stack
                                screenOptions={{
                                    headerShown: false,
                                    contentStyle: { backgroundColor },
                                    presentation: 'transparentModal',
                                }}
                            >
                                <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
                                <Stack.Screen name="(auth)" options={{ animation: 'slide_from_bottom' }} />
                                <Stack.Screen name="image/[id]" options={{ presentation: 'card' }} />
                                <Stack.Screen name="modal" options={{ presentation: 'transparentModal' }} />
                            </Stack>
                        </View>
                    </ThemeProvider>
                </ApiProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
