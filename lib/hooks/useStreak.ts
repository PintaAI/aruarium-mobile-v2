import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getStreakData, 
  recordDailyLogin, 
  shouldRecordDailyLogin, 
  markDailyLoginRecorded,
  StreakData, 
  ActivityResponse,
  recordActivity,
  ActivityRequest
} from '../api/streak';
import { isLoggedIn } from '../auth';

interface UseStreakReturn {
  // Data
  streakData: StreakData | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  recordLogin: () => Promise<ActivityResponse | null>;
  recordActivityAction: (activity: ActivityRequest) => Promise<ActivityResponse | null>;
  refreshStreak: () => void;
  
  // Helpers
  hasLeveledUp: boolean;
  shouldShowStreakCelebration: boolean;
}

export function useStreak(): UseStreakReturn {
  const queryClient = useQueryClient();
  const [hasLeveledUp, setHasLeveledUp] = useState(false);
  const [shouldShowStreakCelebration, setShouldShowStreakCelebration] = useState(false);

  // Query for streak data
  const {
    data: streakData,
    isLoading,
    error,
    refetch: refreshStreak
  } = useQuery({
    queryKey: ['streak'],
    queryFn: getStreakData,
    enabled: false, // We'll enable this manually after checking auth
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Check authentication and enable query
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const loggedIn = await isLoggedIn();
      if (loggedIn) {
        queryClient.setQueryDefaults(['streak'], { enabled: true });
        refreshStreak();
      }
    };
    
    checkAuthAndFetch();
  }, [queryClient, refreshStreak]);

  // Mutation for recording activities
  const activityMutation = useMutation({
    mutationFn: recordActivity,
    onSuccess: (data) => {
      if (data) {
        // Show celebrations for level ups and streak updates
        if (data.level.leveledUp) {
          setHasLeveledUp(true);
          setTimeout(() => setHasLeveledUp(false), 5000); // Hide after 5 seconds
        }
        
        if (data.streak.updated && data.streak.current > data.streak.previous) {
          setShouldShowStreakCelebration(true);
          setTimeout(() => setShouldShowStreakCelebration(false), 3000); // Hide after 3 seconds
        }
        
        // Refresh streak data
        queryClient.invalidateQueries({ queryKey: ['streak'] });
      }
    },
    onError: (error) => {
      console.error('Failed to record activity:', error);
    }
  });

  // Auto-record daily login
  useEffect(() => {
    const handleDailyLogin = async () => {
      try {
        const loggedIn = await isLoggedIn();
        if (!loggedIn) return;

        const shouldRecord = await shouldRecordDailyLogin();
        if (shouldRecord) {
          console.log('🎯 Recording daily login streak...');
          const result = await recordDailyLogin();
          
          if (result) {
            await markDailyLoginRecorded();
            console.log('✅ Daily login streak recorded');
            
            // Show streak celebration if streak was updated
            if (result.streak.updated && result.streak.current > result.streak.previous) {
              setShouldShowStreakCelebration(true);
              setTimeout(() => setShouldShowStreakCelebration(false), 3000);
            }
            
            // Show level up celebration
            if (result.level.leveledUp) {
              setHasLeveledUp(true);
              setTimeout(() => setHasLeveledUp(false), 5000);
            }
            
            // Refresh streak data
            queryClient.invalidateQueries({ queryKey: ['streak'] });
          }
        }
      } catch (error) {
        console.error('Error handling daily login:', error);
      }
    };

    // Small delay to ensure the app is fully loaded
    const timer = setTimeout(handleDailyLogin, 1000);
    return () => clearTimeout(timer);
  }, [queryClient]);

  const recordLogin = useCallback(async (): Promise<ActivityResponse | null> => {
    const result = await activityMutation.mutateAsync({
      type: 'LOGIN',
      description: 'User logged in',
      xpEarned: 10,
      metadata: {
        loginTime: new Date().toISOString(),
        platform: 'mobile'
      }
    });
    
    if (result) {
      await markDailyLoginRecorded();
    }
    
    return result;
  }, [activityMutation]);

  const recordActivityAction = useCallback(async (activity: ActivityRequest): Promise<ActivityResponse | null> => {
    return await activityMutation.mutateAsync(activity);
  }, [activityMutation]);

  return {
    // Data
    streakData: streakData || null,
    isLoading: isLoading || activityMutation.isPending,
    error: error?.message || null,
    
    // Actions
    recordLogin,
    recordActivityAction,
    refreshStreak,
    
    // Helpers
    hasLeveledUp,
    shouldShowStreakCelebration,
  };
}

// Hook for easy streak display
export function useStreakDisplay() {
  const { streakData } = useStreak();
  
  if (!streakData) {
    return {
      currentStreak: 0,
      maxStreak: 0,
      level: 1,
      xp: 0,
      xpProgress: 0,
      xpToNextLevel: 1000,
      isActive: false
    };
  }
  
  const xpForCurrentLevel = (streakData.level - 1) * 1000;
  const xpForNextLevel = streakData.level * 1000;
  const xpProgress = ((streakData.xp - xpForCurrentLevel) / 1000) * 100;
  
  return {
    currentStreak: streakData.currentStreak,
    maxStreak: streakData.maxStreak,
    level: streakData.level,
    xp: streakData.xp,
    xpProgress: Math.min(xpProgress, 100),
    xpToNextLevel: xpForNextLevel - streakData.xp,
    isActive: streakData.streakStatus.isActive
  };
}
