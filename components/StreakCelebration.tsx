import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface StreakCelebrationProps {
  visible: boolean;
  onClose: () => void;
  type: 'streak' | 'levelup';
}

export function StreakCelebration({ visible, onClose, type }: StreakCelebrationProps) {
  if (!visible) return null;

  const config = {
    streak: {
      icon: '🔥',
      title: 'Streak Updated!',
      message: 'Great job! Keep coming back daily to maintain your streak.'
    },
    levelup: {
      icon: '⭐',
      title: 'Level Up!',
      message: "Congratulations! You've reached a new level."
    }
  };

  const { icon, title, message } = config[type];

  return (
    <Pressable
      className="absolute inset-0 bg-black/80 justify-center items-center z-50"
      onPress={onClose}
    >
      <View className="bg-card p-8 rounded-2xl items-center max-w-xs mx-4">
        <Text className="text-6xl mb-4">{icon}</Text>
        <Text className="text-2xl font-bold text-center text-foreground mb-2">
          {title}
        </Text>
        <Text className="text-center text-muted-foreground mb-6">
          {message}
        </Text>
        <Pressable
          className="bg-primary px-6 py-3 rounded-lg"
          onPress={onClose}
        >
          <Text className="text-primary-foreground font-medium">
            Continue
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}