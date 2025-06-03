import React from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { useMatchkorStore } from '../store/gameStore';

import { Trophy, Clock, Target, CheckCircle, Star } from 'lucide-react-native';
import { iconWithClassName } from '~/lib/icons/iconWithClassName';
import { useAutoMatchkorXP, useMatchkorXP } from '~/lib/hooks/useMatchkorXP';

// Register icons with NativeWind
iconWithClassName(Trophy);
iconWithClassName(Clock);
iconWithClassName(Target);
iconWithClassName(CheckCircle);
iconWithClassName(Star);

interface MatchkorGameOverProps {
  onRestart: () => void;
  onTryAgain: () => void;
  onExit: () => void;
}

export default function MatchkorGameOver({ onRestart, onTryAgain, onExit }: MatchkorGameOverProps) {
  const { score, timer, level, matchedPairs, totalPairs, bestTime, gameStatus } = useMatchkorStore();
  const { xpResult, hasEarnedXP } = useAutoMatchkorXP();
  const { getPerformanceRating } = useMatchkorXP();

  // Format timer display (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isCompleted = gameStatus === 'completed';
  const performanceRating = getPerformanceRating(score, timer, level, matchedPairs, totalPairs, isCompleted);

  return (
    <View className="flex-1 justify-center items-center bg-black/80 px-6">
      <View className="bg-card p-6 rounded-xl w-4/5 max-w-md border border-border shadow-lg">
        {/* Game Over/Complete Title */}
        <View className="items-center mb-6">
          <Text className={`text-3xl font-bold mb-1 ${isCompleted ? 'text-green-500' : 'text-primary'}`}>
            {isCompleted ? 'Game Complete!' : 'Game Over'}
          </Text>
          <Text className="text-center text-card-foreground/70 text-sm">
            {isCompleted 
              ? 'Congratulations! You matched all pairs!'
              : 'Better luck next time!'
            }
          </Text>
          {/* Performance Rating */}
          <Text className="text-center text-primary font-semibold mt-2">
            {performanceRating}
          </Text>
        </View>

        {/* Results Section */}
        <View className="bg-background/50 rounded-lg p-4 mb-8">
          {/* Total Score */}
          <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-border">
            <View className="flex-row items-center">
              <Trophy size={28} className="text-amber-500 mr-3" />
              <Text className="text-xl font-semibold">Final Score</Text>
            </View>
            <Text className="text-2xl font-bold text-amber-500">{score}</Text>
          </View>

          {/* Time Taken */}
          <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-border">
            <View className="flex-row items-center">
              <Clock size={24} className="text-blue-500 mr-3" />
              <Text className="text-xl font-semibold">Time</Text>
            </View>
            <Text className="text-2xl font-bold text-blue-500">{formatTime(timer)}</Text>
          </View>

          {/* Level */}
          <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-border">
            <View className="flex-row items-center">
              <Target size={24} className="text-purple-500 mr-3" />
              <Text className="text-xl font-semibold">Level</Text>
            </View>
            <Text className="text-2xl font-bold text-purple-500">{level}</Text>
          </View>

          {/* Matched Pairs */}
          <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-border">
            <View className="flex-row items-center">
              <CheckCircle size={24} className="text-green-500 mr-3" />
              <Text className="text-xl font-semibold">Pairs Matched</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-2xl font-bold text-green-500">{matchedPairs}</Text>
              <Text className="text-lg text-card-foreground/70"> / {totalPairs}</Text>
            </View>
          </View>

          {/* XP Earned */}
          {hasEarnedXP && xpResult && (
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Star size={24} className="text-purple-500 mr-3" />
                <Text className="text-xl font-semibold">XP Earned</Text>
              </View>
              <View className="items-end">
                <Text className="text-2xl font-bold text-purple-500">+{xpResult.xpEarned}</Text>
                {xpResult.streakUpdated && (
                  <Text className="text-xs text-green-500">🔥 Streak updated!</Text>
                )}
                {xpResult.leveledUp && (
                  <Text className="text-xs text-yellow-500">⭐ Level up!</Text>
                )}
              </View>
            </View>
          )}

          {/* Best Time (if available) */}
          {bestTime !== null && (
            <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-border">
              <View className="flex-row items-center">
                <Clock size={20} className="text-amber-600 mr-3" />
                <Text className="text-lg font-semibold">Best Time</Text>
              </View>
              <Text className="text-lg font-bold text-amber-600">{formatTime(bestTime)}</Text>
            </View>
          )}
        </View>

        {/* XP Breakdown (if earned) */}
        {hasEarnedXP && xpResult && xpResult.xpEarned > 0 && (
          <View className="bg-purple-500/10 rounded-lg p-3 mb-6 border border-purple-500/20">
            <Text className="text-center text-purple-500 font-semibold mb-2">XP Breakdown</Text>
            <View className="gap-1">
              <Text className="text-xs text-card-foreground/80 text-center">
                Base: {Math.max(Math.floor(score * 0.3), 10)} • Level: {level * 15} • Completion: {Math.floor((matchedPairs / totalPairs) * 30)}
              </Text>
              {timer <= 60 && (
                <Text className="text-xs text-purple-400 text-center">+ Speed Bonus (Under 1min): 40</Text>
              )}
              {timer <= 120 && timer > 60 && (
                <Text className="text-xs text-purple-400 text-center">+ Speed Bonus (Under 2min): 25</Text>
              )}
              {timer <= 180 && timer > 120 && (
                <Text className="text-xs text-purple-400 text-center">+ Speed Bonus (Under 3min): 15</Text>
              )}
              {isCompleted && (
                <Text className="text-xs text-purple-400 text-center">+ Completion Bonus: 50</Text>
              )}
              {score >= 800 && (
                <Text className="text-xs text-purple-400 text-center">+ High Score Bonus: 30</Text>
              )}
              {level >= 3 && (
                <Text className="text-xs text-purple-400 text-center">+ Level Bonus: {level >= 5 ? 70 : 20}</Text>
              )}
              {(matchedPairs / totalPairs) >= 0.8 && (
                <Text className="text-xs text-purple-400 text-center">+ Good Completion Bonus: 25</Text>
              )}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View className="gap-3">
          {/* Try Again - Same level, restart immediately */}
          <Button 
            className="w-full py-3 bg-primary mb-3"
            onPress={onTryAgain}
          >
            <Text className="text-primary-foreground font-bold">Try Again</Text>
          </Button>
          
          {/* Play Again and Exit */}
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
