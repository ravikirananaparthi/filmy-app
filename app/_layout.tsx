// MUST BE FIRST - Initialize Reactotron in development
if (__DEV__) {
    require('../src/config/reactotron');
}

import { Theme } from '@/constants/theme';
import { ApiProvider } from '@/src/providers/ApiProvider';
import { useAuthStore } from '@/src/store/slices/authSlice';
import {
    GoogleSansFlex_400Regular,
    GoogleSansFlex_500Medium,
    GoogleSansFlex_600SemiBold,
    GoogleSansFlex_700Bold,
    useFonts,
} from '@expo-google-fonts/google-sans-flex';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, router, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

SplashScreen.preventAutoHideAsync();
enableScreens();

function AuthGuard() {
    const { isAuthenticated, isHydrated } = useAuthStore();
    const segments = useSegments();

    useEffect(() => {
        if (!isHydrated) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!isAuthenticated && !inAuthGroup) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            router.replace('/(auth)' as any);
        } else if (isAuthenticated && inAuthGroup) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            router.replace('/(tabs)' as any);
        }
    }, [isAuthenticated, isHydrated, segments]);

    return null;
}

function RootNavigator() {
    const colorScheme = useColorScheme();

    const backgroundColor = colorScheme === 'dark'
        ? Theme.colors.background.dark
        : Theme.colors.background.light;

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : undefined}>
            <View style={{ flex: 1, backgroundColor }}>
                <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
                <AuthGuard />
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor },
                    }}
                >
                    <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
                    <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
                    <Stack.Screen name="search/index" options={{ presentation: 'transparentModal' }} />
                    <Stack.Screen name="image/[id]" options={{ presentation: 'card' }} />
                    <Stack.Screen name="upload/index" options={{ presentation: 'card', animation: 'slide_from_bottom' }} />
                    <Stack.Screen name="wallpaper/[id]" options={{ animation: 'slide_from_bottom' }} />
                    <Stack.Screen name="favorites/liked" options={{ animation: 'slide_from_right' }} />
                    <Stack.Screen name="favorites/saved" options={{ animation: 'slide_from_right' }} />
                    <Stack.Screen name="favorites/folder/[id]" options={{ animation: 'slide_from_right' }} />
                    <Stack.Screen name="favorites/following" options={{ animation: 'slide_from_right' }} />
                    <Stack.Screen name="modal" options={{ presentation: 'transparentModal' }} />
                    <Stack.Screen name="(modal)" options={{ presentation: 'transparentModal' }} />
                </Stack>
            </View>
        </ThemeProvider>
    );
}

export default function RootLayout() {
    const { hydrate } = useAuthStore();

    const [fontsLoaded] = useFonts({
        GoogleSansFlex_400Regular,
        GoogleSansFlex_500Medium,
        GoogleSansFlex_600SemiBold,
        GoogleSansFlex_700Bold,
    });

    useEffect(() => {
        hydrate();
    }, []);

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <ApiProvider>
                    <RootNavigator />
                </ApiProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
