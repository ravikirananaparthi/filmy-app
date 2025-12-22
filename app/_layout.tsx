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
// This uses native Fragment on Android instead of View components
enableScreens();

// If you're loading custom fonts later, keep this ready
// import { useFonts } from 'expo-font';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Example if you add fonts later
  // const [fontsLoaded] = useFonts({
  //   Inter_400: require('../assets/fonts/Inter-Regular.ttf'),
  // });
  // if (!fontsLoaded) return null;

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
                  animation: 'fade',
                  contentStyle: {
                    backgroundColor,
                  },
                }}
              >
                {/* Tabs */}
                <Stack.Screen name="(tabs)" />

                {/* Auth flow */}
                <Stack.Screen name="(auth)" />

                {/* Modals */}
                <Stack.Screen
                  name="modal"
                  options={{ presentation: 'transparentModal' }}
                />
              </Stack>
            </View>
          </ThemeProvider>
        </ApiProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

