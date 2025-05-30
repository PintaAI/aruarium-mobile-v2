import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useMatchkorStore } from '../store/gameStore';
import { Text } from '~/components/ui/text';
import { Progress } from '~/components/ui/progress';
import { cn } from '~/lib/utils';
import { Award, Clock, Target, CheckCircle } from 'lucide-react-native';
import { iconWithClassName } from '~/lib/icons/iconWithClassName';

// Register icons with NativeWind
iconWithClassName(Award);
iconWithClassName(Clock);
iconWithClassName(Target);
iconWithClassName(CheckCircle);

interface MatchkorHUDProps {
  className?: string;
}

export default function MatchkorHUD({ className = '' }: MatchkorHUDProps) {
  const { score, timer, level, matchedPairs, totalPairs, gameStatus } = useMatchkorStore();
  const [displayTimer, setDisplayTimer] = useState(0);

  // Update display timer
  useEffect(() => {
    setDisplayTimer(timer);
  }, [timer]);

  // Calculate progress percentage
  const progressPercentage = totalPairs > 0 ? (matchedPairs / totalPairs) * 100 : 0;

  // Format timer display (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View 
      className={cn(
        'absolute top-1 left-4 right-4 bg-card/90 p-3 rounded-lg border border-border',
        className
      )}
    >
      {/* Top row: Score, Timer, Level */}
      <View className="flex-row justify-between items-center mb-4">
        {/* Score */}
        <View className="flex-row items-center">
          <Award size={16} className="text-amber-500 mr-1" />
          <Text className="font-bold text-sm">{score}</Text>
        </View>

        {/* Timer */}
        <View className="flex-row items-center">
          <Clock size={16} className="text-primary mr-1" />
          <Text 
            className={cn(
              "font-bold text-sm",
              timer > 180 ? "text-red-500" : timer > 120 ? "text-amber-500" : "text-green-500"
            )}
          >
            {formatTime(displayTimer)}
          </Text>
        </View>

        {/* Level */}
        <View className="flex-row items-center">
          <Target size={16} className="text-primary mr-1" />
          <Text className="font-bold text-sm">{level}</Text>
        </View>
      </View>

      {/* Progress section */}
      <View className="mb-1">
  
        
        <Progress 
          value={progressPercentage}
          className="h-2"
          indicatorClassName={cn(
            progressPercentage === 100 ? "bg-green-500" : 
            progressPercentage >= 75 ? "bg-primary" : 
            "bg-blue-500"
          )}
        />
      </View>

      {/* Game status indicator */}
      {gameStatus === 'completed' && (
        <View className="absolute -top-3 -right-3 bg-green-500 rounded-full px-3 py-1">
          <Text className="text-white text-xs font-bold">Complete!</Text>
        </View>
      )}
    </View>
  );
}
