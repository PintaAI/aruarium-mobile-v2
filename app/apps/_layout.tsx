import { Stack } from 'expo-router';
import * as React from 'react';

export default function AppsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="tryout/index" options={{ title: 'Tryout' }} />
      <Stack.Screen name="tryout/[id]" options={{ title: 'Tryout' }} />
      <Stack.Screen name="soal/index" options={{ title: 'Soal' }} />
      <Stack.Screen name="soal/[id]" options={{ title: 'Soal' }} />
      <Stack.Screen name="translate" options={{ title: 'Translate' }} />
      <Stack.Screen name="e-book" options={{ title: 'E-Book' }} />
      <Stack.Screen name="matchkor" options={{ title: 'Matchkor' }} />
    </Stack>
  );
}
