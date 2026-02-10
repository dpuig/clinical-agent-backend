import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { Colors } from '../constants/Colors';
import { ThemeProvider, useTheme } from './ctx';
import { ThemeProvider as NavThemeProvider, DefaultTheme, DarkTheme } from '@react-navigation/native';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(stack)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}

function RootLayoutNav() {
  const { activeTheme } = useTheme();
  const isDark = activeTheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  // Map Neural Violet to React Navigation Theme
  const NavTheme = {
    dark: isDark,
    colors: {
      primary: theme.tint,
      background: theme.background,
      card: theme.background, // Or surface
      text: theme.text,
      border: theme.outline,
      notification: theme.tint,
    },
    fonts: DefaultTheme.fonts, // Use default or map Inter
  };

  return (
    <NavThemeProvider value={NavTheme}>
      <Stack>
        <Stack.Screen name="(stack)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </NavThemeProvider>
  );
}
