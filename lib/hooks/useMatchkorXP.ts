import { useCallback, useEffect, useState } from 'react';
import { useStreak } from './useStreak';
import { useMatchkorStore } from '../game/matchkor/store/gameStore';

interface MatchkorXPResult {
  xpEarned: number;
  activityRecorded: boolean;
  streakUpdated: boolean;
  leveledUp: boolean;
}

/**
 * Hook for managing XP rewards for Matchkor game completion
 */
export function useMatchkorXP() {
  const { recordActivityAction } = useStreak();
  const [hasRecordedXP, setHasRecordedXP] = useState(false);
  const [xpResult, setXpResult] = useState<MatchkorXPResult | null>(null);

  /**
   * Calculate XP based on Matchkor game performance
   */
  const calculateMatchkorXP = useCallback((
    score: number, 
    timer: number, 
    level: number, 
    matchedPairs: number, 
    totalPairs: number,
    isCompleted: boolean
  ): number => {
    // Base XP calculation
    let xp = 0;
    
    // Score-based XP (1 point = 0.3 XP, with minimum 10 XP)
    xp += Math.max(Math.floor(score * 0.3), 10);
    
    // Level bonus (15 XP per level)
    xp += level * 15;
    
    // Completion bonus
    if (isCompleted) {
      xp += 50; // Bonus for completing all pairs
    }
    
    // Completion percentage bonus
    const completionRate = matchedPairs / totalPairs;
    xp += Math.floor(completionRate * 30);
    
    // Time-based bonus (faster completion = more XP)
    if (timer <= 60) xp += 40;      // Under 1 minute
    else if (timer <= 120) xp += 25; // Under 2 minutes
    else if (timer <= 180) xp += 15; // Under 3 minutes
    
    // Performance bonuses
    if (score >= 800) xp += 30;     // High score bonus
    if (level >= 3) xp += 20;       // Mid-level bonus
    if (level >= 5) xp += 50;       // Max level bonus
    if (completionRate >= 0.8) xp += 25; // Good completion rate
    
    // Cap XP at reasonable maximum
    return Math.min(xp, 400);
  }, []);

  /**
   * Record Matchkor game completion activity and earn XP
   */
  const recordMatchkorCompletion = useCallback(async (
    score: number, 
    timer: number, 
    level: number, 
    matchedPairs: number,
    totalPairs: number,
    isCompleted: boolean
  ): Promise<MatchkorXPResult> => {
    try {
      const xpEarned = calculateMatchkorXP(score, timer, level, matchedPairs, totalPairs, isCompleted);
      
      console.log(`🎮 Recording Matchkor game completion: Score=${score}, Time=${timer}s, Level=${level}, Pairs=${matchedPairs}/${totalPairs}, XP=${xpEarned}`);
      
      const result = await recordActivityAction({
        type: 'PLAY_GAME',
        description: `Played Matchkor game - Score: ${score}, Time: ${timer}s, Level: ${level}, Pairs: ${matchedPairs}/${totalPairs}`,
        xpEarned,
        metadata: {
          gameType: 'matchkor',
          score,
          timer,
          level,
          matchedPairs,
          totalPairs,
          isCompleted,
          completedAt: new Date().toISOString()
        }
      });

      const gameResult: MatchkorXPResult = {
        xpEarned,
        activityRecorded: !!result,
        streakUpdated: result?.streak?.updated || false,
        leveledUp: result?.level?.leveledUp || false
      };

      setXpResult(gameResult);
      setHasRecordedXP(true);
      
      if (result) {
        console.log(`✅ Matchkor XP recorded: +${xpEarned} XP`);
        if (result.streak.updated) {
          console.log(`🔥 Streak: ${result.streak.previous} → ${result.streak.current}`);
        }
        if (result.level.leveledUp) {
          console.log(`🌟 Level up! ${result.level.previous} → ${result.level.current}`);
        }
      }

      return gameResult;
    } catch (error) {
      console.error('Error recording Matchkor game completion:', error);
      return {
        xpEarned: 0,
        activityRecorded: false,
        streakUpdated: false,
        leveledUp: false
      };
    }
  }, [calculateMatchkorXP, recordActivityAction]);

  /**
   * Reset Matchkor XP tracking state
   */
  const resetMatchkorXP = useCallback(() => {
    setHasRecordedXP(false);
    setXpResult(null);
  }, []);

  /**
   * Get performance rating based on score, time, and completion
   */
  const getPerformanceRating = useCallback((
    score: number, 
    timer: number, 
    level: number, 
    matchedPairs: number,
    totalPairs: number,
    isCompleted: boolean
  ): string => {
    const completionRate = matchedPairs / totalPairs;
    
    if (isCompleted && timer <= 60 && score >= 800) return 'Perfect! 🏆';
    if (isCompleted && timer <= 120 && score >= 600) return 'Excellent! ⭐';
    if (completionRate >= 0.8 && score >= 400) return 'Great! 🎯';
    if (completionRate >= 0.6 && score >= 200) return 'Good! 👍';
    if (completionRate >= 0.4) return 'Nice Try! 💪';
    return 'Keep Practicing! 📚';
  }, []);

  return {
    recordMatchkorCompletion,
    resetMatchkorXP,
    calculateMatchkorXP,
    getPerformanceRating,
    hasRecordedXP,
    xpResult
  };
}

/**
 * Hook to automatically track Matchkor game over and record XP
 */
export function useAutoMatchkorXP() {
  const { gameStatus, score, timer, level, matchedPairs, totalPairs } = useMatchkorStore();
  const { recordMatchkorCompletion, resetMatchkorXP, xpResult } = useMatchkorXP();
  const [previousGameStatus, setPreviousGameStatus] = useState<string>('');
  const [hasAutoRecorded, setHasAutoRecorded] = useState(false);

  // Auto-record XP when game ends (either completed or game over)
  useEffect(() => {
    // Detect when game transitions to completed or game over state
    if ((gameStatus === 'completed' || gameStatus === 'gameOver') && 
        previousGameStatus !== gameStatus && 
        !hasAutoRecorded &&
        (score > 0 || matchedPairs > 0)) {
      
      const isCompleted = gameStatus === 'completed';
      recordMatchkorCompletion(score, timer, level, matchedPairs, totalPairs, isCompleted);
      setHasAutoRecorded(true);
    }
    setPreviousGameStatus(gameStatus);
  }, [gameStatus, previousGameStatus, score, timer, level, matchedPairs, totalPairs, recordMatchkorCompletion, hasAutoRecorded]);

  // Reset XP tracking when game restarts
  useEffect(() => {
    if (gameStatus === 'idle' || gameStatus === 'playing') {
      resetMatchkorXP();
      setHasAutoRecorded(false);
    }
  }, [gameStatus, resetMatchkorXP]);

  return {
    xpResult,
    hasEarnedXP: !!xpResult?.xpEarned
  };
}
