import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Lato_300Light } from '@expo-google-fonts/lato/300Light';
import { Lato_300Light_Italic } from '@expo-google-fonts/lato/300Light_Italic';
import { Lato_400Regular } from '@expo-google-fonts/lato/400Regular';
import { Lato_400Regular_Italic } from '@expo-google-fonts/lato/400Regular_Italic';
import { Lato_700Bold } from '@expo-google-fonts/lato/700Bold';
import { Lato_700Bold_Italic } from '@expo-google-fonts/lato/700Bold_Italic';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    'Lato-Light': Lato_300Light,
    'Lato-LightItalic': Lato_300Light_Italic,
    'Lato-Regular': Lato_400Regular,
    'Lato-RegularItalic': Lato_400Regular_Italic,
    'Lato-Bold': Lato_700Bold,
    'Lato-BoldItalic': Lato_700Bold_Italic
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth/welcome" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
        <Stack.Screen name="auth/forgot" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
