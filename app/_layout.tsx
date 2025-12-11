import { Theme } from '@/constants/theme';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// If you're loading custom fonts later, keep this ready
// import { useFonts } from 'expo-font';

export default function RootLayout() {
  // Example if you add fonts later
  // const [fontsLoaded] = useFonts({
  //   Inter_400: require('../assets/fonts/Inter-Regular.ttf'),
  // });
  // if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={DarkTheme}>
          <View style={{ flex: 1, backgroundColor: Theme.colors.background.dark }}>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'fade',
                contentStyle: {
                  backgroundColor: Theme.colors.background.dark,
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
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
