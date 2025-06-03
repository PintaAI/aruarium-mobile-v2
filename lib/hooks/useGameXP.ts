import { useCallback, useEffect, useState } from 'react';
import { useStreak } from './useStreak';
import { useGameStore } from '../game/z-type/store/gameStore';

interface GameXPResult {
  xpEarned: number;
  activityRecorded: boolean;
  streakUpdated: boolean;
  leveledUp: boolean;
}

/**
 * Hook for managing XP rewards for Z-type game completion
 */
export function useGameXP() {
  const { recordActivityAction } = useStreak();
  const [hasRecordedXP, setHasRecordedXP] = useState(false);
  const [xpResult, setXpResult] = useState<GameXPResult | null>(null);

  /**
   * Calculate XP based on game performance
   */
  const calculateGameXP = useCallback((score: number, level: number, streak: number): number => {
    // Base XP calculation
    let xp = 0;
    
    // Score-based XP (1 point = 0.5 XP, with minimum 5 XP)
    xp += Math.max(Math.floor(score * 0.5), 5);
    
    // Level bonus (10 XP per level reached)
    xp += level * 10;
    
    // Streak bonus (2 XP per streak point)
    xp += streak * 2;
    
    // Performance multipliers
    if (score >= 1000) xp += 50; // High score bonus
    if (level >= 3) xp += 30;    // Mid-level bonus
    if (level >= 5) xp += 70;    // Max level bonus
    if (streak >= 10) xp += 25;  // Good streak bonus
    if (streak >= 20) xp += 50;  // Great streak bonus
    
    // Cap XP at reasonable maximum
    return Math.min(xp, 300);
  }, []);

  /**
   * Record game completion activity and earn XP
   */
  const recordGameCompletion = useCallback(async (
    score: number, 
    level: number, 
    streak: number
  ): Promise<GameXPResult> => {
    try {
      const xpEarned = calculateGameXP(score, level, streak);
      
      console.log(`🎮 Recording Z-type game completion: Score=${score}, Level=${level}, Streak=${streak}, XP=${xpEarned}`);
      
      const result = await recordActivityAction({
        type: 'PLAY_GAME',
        description: `Played Z-type game - Score: ${score}, Level: ${level}, Streak: ${streak}`,
        xpEarned,
        metadata: {
          gameType: 'z-type',
          score,
          level,
          streak,
          completedAt: new Date().toISOString()
        }
      });

      const gameResult: GameXPResult = {
        xpEarned,
        activityRecorded: !!result,
        streakUpdated: result?.streak?.updated || false,
        leveledUp: result?.level?.leveledUp || false
      };

      setXpResult(gameResult);
      setHasRecordedXP(true);
      
      if (result) {
        console.log(`✅ Z-type XP recorded: +${xpEarned} XP`);
        if (result.streak.updated) {
          console.log(`🔥 Streak: ${result.streak.previous} → ${result.streak.current}`);
        }
        if (result.level.leveledUp) {
          console.log(`🌟 Level up! ${result.level.previous} → ${result.level.current}`);
        }
      }

      return gameResult;
    } catch (error) {
      console.error('Error recording game completion:', error);
      return {
        xpEarned: 0,
        activityRecorded: false,
        streakUpdated: false,
        leveledUp: false
      };
    }
  }, [calculateGameXP, recordActivityAction]);

  /**
   * Reset game XP tracking state
   */
  const resetGameXP = useCallback(() => {
    setHasRecordedXP(false);
    setXpResult(null);
  }, []);

  /**
   * Get performance rating based on score and level
   */
  const getPerformanceRating = useCallback((score: number, level: number, streak: number): string => {
    if (level >= 5 && score >= 1500) return 'Legendary! 🏆';
    if (level >= 4 && score >= 1000) return 'Excellent! ⭐';
    if (level >= 3 && score >= 500) return 'Great! 🎯';
    if (level >= 2 && score >= 200) return 'Good! 👍';
    if (score >= 100) return 'Nice Try! 💪';
    return 'Keep Practicing! 📚';
  }, []);

  return {
    recordGameCompletion,
    resetGameXP,
    calculateGameXP,
    getPerformanceRating,
    hasRecordedXP,
    xpResult
  };
}

/**
 * Hook to automatically track game over and record XP
 */
export function useAutoGameXP() {
  const { isGameOver, score, level, streak } = useGameStore();
  const { recordGameCompletion, resetGameXP, xpResult } = useGameXP();
  const [previousGameOver, setPreviousGameOver] = useState(false);

  // Auto-record XP when game ends
  useEffect(() => {
    // Detect when game transitions from running to game over
    if (isGameOver && !previousGameOver && score > 0) {
      recordGameCompletion(score, level, streak);
    }
    setPreviousGameOver(isGameOver);
  }, [isGameOver, previousGameOver, score, level, streak, recordGameCompletion]);

  // Reset XP tracking when game restarts
  useEffect(() => {
    if (!isGameOver && previousGameOver) {
      resetGameXP();
    }
  }, [isGameOver, previousGameOver, resetGameXP]);

  return {
    xpResult,
    hasEarnedXP: !!xpResult?.xpEarned
  };
}
