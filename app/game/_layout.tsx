import { Stack } from 'expo-router';
import * as React from 'react';

export default function GameLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_bottom',
      }}
    >
      <Stack.Screen name="z-type" />
      <Stack.Screen name="flashcard" />
      <Stack.Screen name="matchkor" />
    </Stack>
  );
}
