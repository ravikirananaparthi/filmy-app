// MUST BE FIRST - Initialize Reactotron in development
if (__DEV__) {
    require('../src/config/reactotron');
}

import { Theme } from '@/constants/theme';
import { ApiProvider } from '@/src/providers/ApiProvider';
import {
    GoogleSansFlex_400Regular,
    GoogleSansFlex_500Medium,
    GoogleSansFlex_600SemiBold,
    GoogleSansFlex_700Bold,
    useFonts,
} from '@expo-google-fonts/google-sans-flex';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Enable native screens for better performance
enableScreens();

export default function RootLayout() {
    const colorScheme = useColorScheme();

    const [fontsLoaded] = useFonts({
        GoogleSansFlex_400Regular,
        GoogleSansFlex_500Medium,
        GoogleSansFlex_600SemiBold,
        GoogleSansFlex_700Bold,
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    const backgroundColor = colorScheme === 'dark'
        ? Theme.colors.background.dark
        : Theme.colors.background.light;

    if (!fontsLoaded) {
        return null;
    }

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
                                <Stack.Screen name="wallpaper/[id]" options={{ animation: 'slide_from_bottom' }} />
                                <Stack.Screen name="modal" options={{ presentation: 'transparentModal' }} />
                            </Stack>
                        </View>
                    </ThemeProvider>
                </ApiProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
