import { API_BASE_URL } from '../config';
import { fetchWithAuth, getAuthHeader } from '../auth';

// Types
export interface StreakData {
  currentStreak: number;
  maxStreak: number;
  lastActivityDate: string | null;
  daysSinceLastActivity: number | null;
  shouldResetStreak: boolean;
  xp: number;
  level: number;
  recentActivities: ActivityLog[];
  streakStatus: {
    isActive: boolean;
    canContinueToday: boolean;
    needsActivityToday: boolean;
    missedDays: number;
  };
}

export interface ActivityLog {
  id: string;
  type: string;
  description: string | null;
  previousStreak: number | null;
  newStreak: number | null;
  xpEarned: number | null;
  createdAt: string;
}

export interface ActivityRequest {
  type: ActivityType;
  description?: string;
  xpEarned?: number;
  metadata?: Record<string, any>;
}

export interface ActivityResponse {
  streak: {
    previous: number;
    current: number;
    max: number;
    updated: boolean;
  };
  xp: {
    previous: number;
    earned: number;
    current: number;
  };
  level: {
    previous: number;
    current: number;
    leveledUp: boolean;
  };
  activity: {
    id: string;
    type: string;
    description: string;
    createdAt: string;
  };
}

export type ActivityType = 
  | 'LOGIN'
  | 'COMPLETE_MODULE'
  | 'COMPLETE_COURSE'
  | 'COMPLETE_QUIZ'
  | 'VOCABULARY_PRACTICE'
  | 'DAILY_CHALLENGE'
  | 'SUBMIT_ASSIGNMENT'
  | 'PARTICIPATE_LIVE_SESSION'
  | 'PLAY_GAME'
  | 'OTHER';

/**
 * Get current user's streak data
 */
export async function getStreakData(): Promise<StreakData | null> {
  try {
    console.log('🔥 Fetching streak data...');
    
    const response = await fetchWithAuth(`${API_BASE_URL}/api/mobile/streak`);
    
    if (!response.ok) {
      console.error('Failed to fetch streak data:', response.status);
      return null;
    }
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Streak data retrieved successfully');
      return data.data;
    } else {
      console.error('Streak API returned error:', data.error);
      return null;
    }
  } catch (error) {
    console.error('Error fetching streak data:', error);
    return null;
  }
}

/**
 * Record a new activity
 */
export async function recordActivity(activity: ActivityRequest): Promise<ActivityResponse | null> {
  try {
    console.log(`🎯 Recording activity: ${activity.type}`);
    
    const response = await fetchWithAuth(`${API_BASE_URL}/api/mobile/streak`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activity),
    });
    
    if (!response.ok) {
      console.error('Failed to record activity:', response.status);
      return null;
    }
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Activity recorded successfully');
      console.log(`🔥 Streak: ${data.data.streak.previous} → ${data.data.streak.current}`);
      return data.data;
    } else {
      console.error('Activity recording API returned error:', data.error);
      return null;
    }
  } catch (error) {
    console.error('Error recording activity:', error);
    return null;
  }
}

/**
 * Record daily login activity
 */
export async function recordDailyLogin(): Promise<ActivityResponse | null> {
  return recordActivity({
    type: 'LOGIN',
    description: 'Daily app login',
    xpEarned: 10,
    metadata: {
      loginTime: new Date().toISOString(),
      platform: 'mobile'
    }
  });
}

/**
 * Record module completion
 */
export async function recordModuleCompletion(moduleId: number, moduleName: string): Promise<ActivityResponse | null> {
  return recordActivity({
    type: 'COMPLETE_MODULE',
    description: `Completed module: ${moduleName}`,
    xpEarned: 50,
    metadata: {
      moduleId,
      moduleName,
      completedAt: new Date().toISOString()
    }
  });
}

/**
 * Record quiz completion
 */
export async function recordQuizCompletion(quizId: number, score: number): Promise<ActivityResponse | null> {
  return recordActivity({
    type: 'COMPLETE_QUIZ',
    description: `Completed quiz with score: ${score}%`,
    xpEarned: Math.floor(score / 2), // 0.5 XP per percentage point
    metadata: {
      quizId,
      score,
      completedAt: new Date().toISOString()
    }
  });
}

/**
 * Record vocabulary practice
 */
export async function recordVocabularyPractice(wordsCount: number): Promise<ActivityResponse | null> {
  return recordActivity({
    type: 'VOCABULARY_PRACTICE',
    description: `Practiced ${wordsCount} vocabulary words`,
    xpEarned: wordsCount * 2, // 2 XP per word
    metadata: {
      wordsCount,
      practicedAt: new Date().toISOString()
    }
  });
}

/**
 * Check if user needs to record daily login
 * Uses local storage to track if login was already recorded today
 */
export async function shouldRecordDailyLogin(): Promise<boolean> {
  try {
    const today = new Date().toDateString();
    const lastLoginDate = await import('expo-secure-store').then(store => 
      store.getItemAsync('last_login_streak_date')
    );
    
    return lastLoginDate !== today;
  } catch (error) {
    console.error('Error checking daily login status:', error);
    return true; // Default to recording if we can't check
  }
}

/**
 * Mark daily login as recorded for today
 */
export async function markDailyLoginRecorded(): Promise<void> {
  try {
    const today = new Date().toDateString();
    await import('expo-secure-store').then(store => 
      store.setItemAsync('last_login_streak_date', today)
    );
  } catch (error) {
    console.error('Error marking daily login as recorded:', error);
  }
}
