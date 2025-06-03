import { useCallback } from 'react';
import { useStreak } from './useStreak';
import { 
  recordModuleCompletion, 
  recordQuizCompletion, 
  recordVocabularyPractice,
  ActivityRequest 
} from '../api/streak';

/**
 * Hook for common streak-related actions in learning activities
 */
export function useStreakActions() {
  const { recordActivityAction } = useStreak();

  const recordModuleComplete = useCallback(async (moduleId: number, moduleName: string) => {
    return await recordActivityAction({
      type: 'COMPLETE_MODULE',
      description: `Completed module: ${moduleName}`,
      xpEarned: 50,
      metadata: {
        moduleId,
        moduleName,
        completedAt: new Date().toISOString()
      }
    });
  }, [recordActivityAction]);

  const recordQuizComplete = useCallback(async (quizId: number, score: number) => {
    return await recordActivityAction({
      type: 'COMPLETE_QUIZ',
      description: `Completed quiz with score: ${score}%`,
      xpEarned: Math.floor(score / 2),
      metadata: {
        quizId,
        score,
        completedAt: new Date().toISOString()
      }
    });
  }, [recordActivityAction]);

  const recordVocabPractice = useCallback(async (wordsCount: number) => {
    return await recordActivityAction({
      type: 'VOCABULARY_PRACTICE',
      description: `Practiced ${wordsCount} vocabulary words`,
      xpEarned: wordsCount * 2,
      metadata: {
        wordsCount,
        practicedAt: new Date().toISOString()
      }
    });
  }, [recordActivityAction]);

  const recordCourseComplete = useCallback(async (courseId: number, courseName: string) => {
    return await recordActivityAction({
      type: 'COMPLETE_COURSE',
      description: `Completed course: ${courseName}`,
      xpEarned: 200, // Higher XP for course completion
      metadata: {
        courseId,
        courseName,
        completedAt: new Date().toISOString()
      }
    });
  }, [recordActivityAction]);

  const recordDailyChallenge = useCallback(async (challengeId: string, challengeName: string, score?: number) => {
    return await recordActivityAction({
      type: 'DAILY_CHALLENGE',
      description: `Completed daily challenge: ${challengeName}`,
      xpEarned: score ? Math.floor(score / 2) : 30,
      metadata: {
        challengeId,
        challengeName,
        score,
        completedAt: new Date().toISOString()
      }
    });
  }, [recordActivityAction]);

  const recordLiveSessionParticipation = useCallback(async (sessionId: string, sessionName: string, durationMinutes?: number) => {
    return await recordActivityAction({
      type: 'PARTICIPATE_LIVE_SESSION',
      description: `Participated in live session: ${sessionName}`,
      xpEarned: durationMinutes ? Math.min(durationMinutes * 2, 100) : 40, // 2 XP per minute, max 100
      metadata: {
        sessionId,
        sessionName,
        durationMinutes,
        participatedAt: new Date().toISOString()
      }
    });
  }, [recordActivityAction]);

  const recordAssignmentSubmission = useCallback(async (assignmentId: string, assignmentName: string, grade?: number) => {
    return await recordActivityAction({
      type: 'SUBMIT_ASSIGNMENT',
      description: `Submitted assignment: ${assignmentName}`,
      xpEarned: grade ? Math.floor(grade / 2) : 25,
      metadata: {
        assignmentId,
        assignmentName,
        grade,
        submittedAt: new Date().toISOString()
      }
    });
  }, [recordActivityAction]);

  const recordCustomActivity = useCallback(async (activity: ActivityRequest) => {
    return await recordActivityAction(activity);
  }, [recordActivityAction]);

  return {
    recordModuleComplete,
    recordQuizComplete,
    recordVocabPractice,
    recordCourseComplete,
    recordDailyChallenge,
    recordLiveSessionParticipation,
    recordAssignmentSubmission,
    recordCustomActivity,
  };
}

/**
 * Hook for streak-aware module completion that automatically records streak
 * Usage: const { completeModule } = useModuleCompletion();
 */
export function useModuleCompletion() {
  const { recordModuleComplete } = useStreakActions();

  const completeModule = useCallback(async (
    moduleId: number, 
    moduleName: string,
    onSuccess?: () => void,
    onError?: (error: any) => void
  ) => {
    try {
      const result = await recordModuleComplete(moduleId, moduleName);
      
      if (result) {
        console.log(`✅ Module completion recorded: ${moduleName}`);
        console.log(`🔥 Streak: ${result.streak.previous} → ${result.streak.current}`);
        console.log(`💎 XP: ${result.xp.previous} → ${result.xp.current}`);
        
        if (result.level.leveledUp) {
          console.log(`🌟 Level up! Level ${result.level.previous} → ${result.level.current}`);
        }
        
        onSuccess?.();
        return result;
      } else {
        throw new Error('Failed to record module completion');
      }
    } catch (error) {
      console.error('Error completing module:', error);
      onError?.(error);
      return null;
    }
  }, [recordModuleComplete]);

  return {
    completeModule,
  };
}

/**
 * Hook for streak-aware quiz completion
 */
export function useQuizCompletion() {
  const { recordQuizComplete } = useStreakActions();

  const completeQuiz = useCallback(async (
    quizId: number,
    score: number,
    onSuccess?: (result: any) => void,
    onError?: (error: any) => void
  ) => {
    try {
      const result = await recordQuizComplete(quizId, score);
      
      if (result) {
        console.log(`✅ Quiz completion recorded with score: ${score}%`);
        console.log(`🔥 Streak: ${result.streak.previous} → ${result.streak.current}`);
        console.log(`💎 XP earned: ${result.xp.earned}`);
        
        onSuccess?.(result);
        return result;
      } else {
        throw new Error('Failed to record quiz completion');
      }
    } catch (error) {
      console.error('Error completing quiz:', error);
      onError?.(error);
      return null;
    }
  }, [recordQuizComplete]);

  return {
    completeQuiz,
  };
}
