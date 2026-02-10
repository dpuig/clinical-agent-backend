import { Stack } from 'expo-router';
import React from 'react';
import { useTheme } from '@/app/ctx';
import { Colors } from '@/constants/Colors';

export default function StackLayout() {
  const { activeTheme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: activeTheme === 'dark' ? Colors.dark.background : Colors.light.background,
        }
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="explore" options={{ headerShown: false }} />
    </Stack>
  );
}
