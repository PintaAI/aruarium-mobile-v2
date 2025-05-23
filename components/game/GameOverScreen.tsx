import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { useGameStore } from '~/lib/game/z-type/store/gameStore';
import { Trophy, Zap, Target } from 'lucide-react-native';
import { iconWithClassName } from '~/lib/icons/iconWithClassName';

// Register icons with NativeWind
iconWithClassName(Trophy);
iconWithClassName(Zap);
iconWithClassName(Target);

interface GameOverScreenProps {
  onRestart: () => void;
  onTryAgain: () => void;
  onExit: () => void;
}

export default function GameOverScreen({ onRestart, onTryAgain, onExit }: GameOverScreenProps) {
  const { score, streak, level } = useGameStore();

  return (
    <View className="flex-1 justify-center items-center bg-black/80 px-6">
      <View className="bg-card p-6 rounded-xl w-4/5 max-w-md border border-border shadow-lg">
        {/* Game Over Title */}
        <View className="items-center mb-6">
          <Text className="text-3xl font-bold text-primary mb-1">Game Over</Text>
          <Text className="text-center text-card-foreground/70 text-sm">
            Your typing adventure has ended!
          </Text>
        </View>

        {/* Results Section */}
        <View className="bg-background/50 rounded-lg p-4 mb-8">
          {/* Total Score */}
          <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-border">
            <View className="flex-row items-center">
              <Trophy size={28} className="text-amber-500 mr-3" />
              <Text className="text-xl font-semibold">Total Score</Text>
            </View>
            <Text className="text-2xl font-bold text-amber-500">{score}</Text>
          </View>

          {/* Level Reached */}
          <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-border">
            <View className="flex-row items-center">
              <Target size={24} className="text-primary mr-3" />
              <Text className="text-xl font-semibold">Level Reached</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-2xl font-bold text-primary">{level}</Text>
              <Text className="text-lg text-card-foreground/70"> / 5</Text>
            </View>
          </View>

          {/* Word Streak */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Zap size={24} className="text-green-500 mr-3" />
              <Text className="text-xl font-semibold">Best Streak</Text>
            </View>
            <Text className="text-2xl font-bold text-green-500">{streak}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="gap-3">
          {/* Try Again - Same level, remount game engine immediately */}
          <Button 
            className="w-full py-3 bg-primary mb-3"
            onPress={onTryAgain}
          >
            <Text className="text-primary-foreground font-bold">Try Again</Text>
          </Button>
          
          {/* Play Again - Reset and go to start screen */}
          <View className="flex-row gap-3">
            <Button 
              className="flex-1 py-3 bg-secondary"
              onPress={onRestart}
            >
              <Text className="text-secondary-foreground font-bold">Start Screen</Text>
            </Button>
            <Button 
              className="flex-1 py-3"
              variant="destructive"
              onPress={onExit}
            >
              <Text className="text-destructive-foreground font-bold">Exit</Text>
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}
