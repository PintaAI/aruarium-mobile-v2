import { Stack } from 'expo-router';
import * as React from 'react';

export default function GameLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="z-type" />
      <Stack.Screen name="flashcard" />
    </Stack>
  );
}
