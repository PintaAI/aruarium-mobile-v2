import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useGameStore } from '~/lib/game/z-type/store/gameStore';
import { Text } from '~/components/ui/text';
import { Progress } from '~/components/ui/progress';
import { cn } from '~/lib/utils';
import { Award, Zap, Target, Eye, Clock } from 'lucide-react-native';
import { iconWithClassName } from '~/lib/icons/iconWithClassName';

// Register icons with NativeWind
iconWithClassName(Award);
iconWithClassName(Zap);
iconWithClassName(Target);
iconWithClassName(Eye);
iconWithClassName(Clock);

interface GameHUDProps {
  className?: string;
}

const STREAK_THRESHOLD_FOR_LEVEL_UP = 10;

/**
 * Game HUD component that displays score, streak, and level information
 */
export default function GameHUD({ className = '' }: GameHUDProps) {
  const { score, streak, level, perkActive, perkTimeout } = useGameStore();
  const [perkTimeRemaining, setPerkTimeRemaining] = useState<number | null>(null);
  
  // Constants
  const PERK_DURATION_SECONDS = 10; // 10 seconds - matches PERK_DURATION in MovementSystem.ts (10000ms)
  
  // Calculate and update perk time remaining
  useEffect(() => {
    // If no perk is active, there's no need to track time
    if (!perkActive || perkTimeout === null) {
      setPerkTimeRemaining(null);
      return;
    }
    
    // Make sure perkTimeout is a timestamp (large number)
    if (typeof perkTimeout !== 'number' || perkTimeout < 1000000000000) {
      console.warn('Invalid perkTimeout value:', perkTimeout);
      setPerkTimeRemaining(null);
      return;
    }
    
    // Initial calculation
    const calculateTimeLeft = () => {
      const elapsedSeconds = Math.floor((Date.now() - perkTimeout) / 1000);
      const timeLeft = PERK_DURATION_SECONDS - elapsedSeconds;
      return timeLeft > 0 ? timeLeft : 0;
    };
    
    // Set initial value immediately
    setPerkTimeRemaining(calculateTimeLeft());
    
    // Update the timer every second
    const interval = setInterval(() => {
      const timeLeft = calculateTimeLeft();
      setPerkTimeRemaining(timeLeft);
      
      // If time has run out, clear interval (though the perk itself will be cleared by the timeout)
      if (timeLeft <= 0) {
        clearInterval(interval);
      }
    }, 1000);
    
    // Cleanup interval on component unmount or perk change
    return () => clearInterval(interval);
  }, [perkActive, perkTimeout]);
  
  // Calculate streak progress percentage
  const streakProgress = (streak / STREAK_THRESHOLD_FOR_LEVEL_UP) * 100;
  
  return (
    <View className={cn('absolute top-1 left-4 right-4 bg-card/80 p-3 rounded-lg border', 
      perkActive === 'reveal_meaning' ? 'border-amber-500' : 
      perkActive === 'slowmotion' ? 'border-blue-500' : 
      'border-border', 
      className
    )}>
      {/* Score, Streak and Level in single row */}
      <View className="flex flex-row justify-between mb-2">
        {/* Score display */}
        <View className="items-center flex-row">
          <Award size={15} className="text-muted-foreground mr-1" />
          <Text className="font-bold text-md">{score}</Text>
        </View>
        
        {/* Streak display */}
        <View className="items-center flex-row">
          <Zap 
            size={15}
            className={cn(
              "mr-1", 
              streak >= 7 ? "text-red-500" : streak >= 4 ? "text-amber-500" : "text-green-500"
            )} 
          />
          <Text 
            className={cn(
              "font-bold text-md", 
              streak >= 7 ? "text-red-500" : streak >= 4 ? "text-amber-500" : "text-green-500"
            )}
          >
            {streak}
          </Text>
        </View>
        
        {/* Level display */}
        <View className="items-center flex-row">
          <Target size={15} className="text-muted-foreground mr-1" />
          <Text className="font-bold text-xl">{level}</Text>
          <Text className="text-muted-foreground ml-1 text-xs">/ 5</Text>
        </View>
      </View>
      
      {/* Progress bar for streak */}
      <View className="mb-1">
        <View className="flex flex-row justify-between items-center">

        </View>
        <Progress 
          value={streakProgress}
          className="h-2 mt-1"
          indicatorClassName={cn(
            streak >= 7 ? "bg-red-500" : streak >= 4 ? "bg-amber-500" : "bg-green-500"
          )}
        />
      </View>
      
      {/* Active perk badge */}
      {perkActive && (
        <View className="absolute top-0 right-0 -mt-3 -mr-3 flex-row items-center">
          <View className={cn(
            "rounded-full h-7 w-7 items-center justify-center",
            perkActive === 'reveal_meaning' ? "bg-amber-500" : "bg-blue-500"
          )}>
            {perkActive === 'reveal_meaning' ? (
              <Eye size={15} className="text-white" />
            ) : perkActive === 'slowmotion' ? (
              <Clock size={15} className="text-white" />
            ) : null}
          </View>
          
          {/* Separate timer badge that's more visible */}
          {perkTimeRemaining !== null && (
            <View className="absolute -top-2 -right-2 bg-black/80 rounded-full h-5 w-5 items-center justify-center border border-white">
              <Text className="text-[10px] text-white font-bold">{perkTimeRemaining}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
