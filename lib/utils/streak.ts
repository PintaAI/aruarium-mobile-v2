import { ActivityLog } from '~/lib/api/streak';

interface DayData {
  date: Date;
  hasActivity: boolean;
  xpGained: number;
  activities: ActivityLog[];
}

export const getWeekData = (recentActivities: ActivityLog[]): DayData[] => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDay);

  const week: DayData[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    
    // Filter activities for this specific day
    const dayActivities = recentActivities.filter((activity: ActivityLog) => {
      const activityDate = new Date(activity.createdAt);
      return activityDate.toDateString() === date.toDateString();
    });

    // Calculate total XP gained for this day
    const xpGained = dayActivities.reduce((total: number, activity: ActivityLog) => {
      return total + (activity.xpEarned || 0);
    }, 0);

    week.push({
      date,
      hasActivity: dayActivities.length > 0,
      xpGained,
      activities: dayActivities
    });
  }
  return week;
};

export const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return 'Just now';
};