import { fetchWithAuth } from '~/lib/auth';
import { API_BASE_URL } from '~/lib/config';

// Types
export interface LeaderboardUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  xp: number;
  level: number;
  currentStreak: number;
  maxStreak: number;
  rank: number;
  // Activity leaderboard specific fields
  activityCount?: number;
  totalXpEarned?: number;
}

export interface LeaderboardResponse {
  users: LeaderboardUser[];
  currentUser?: LeaderboardUser;
  totalUsers: number;
}

/**
 * Get global XP leaderboard
 */
export async function getXPLeaderboard(limit: number = 50): Promise<LeaderboardResponse> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/mobile/leaderboard/xp?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Handle API response format: { success: true, data: {...} }
    if (result.success && result.data) {
      return result.data;
    } else {
      throw new Error(result.error || 'Invalid API response format');
    }
  } catch (error) {
    console.error('Error fetching XP leaderboard:', error);
    // Return mock data for development
    return getMockLeaderboard();
  }
}

/**
 * Get streak leaderboard
 */
export async function getStreakLeaderboard(limit: number = 50): Promise<LeaderboardResponse> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/mobile/leaderboard/streak?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Handle API response format: { success: true, data: {...} }
    if (result.success && result.data) {
      return result.data;
    } else {
      throw new Error(result.error || 'Invalid API response format');
    }
  } catch (error) {
    console.error('Error fetching streak leaderboard:', error);
    // Return mock data for development
    return getMockStreakLeaderboard();
  }
}

/**
 * Get activity leaderboard (most active users)
 */
export async function getActivityLeaderboard(limit: number = 50, days: number = 30): Promise<LeaderboardResponse> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/mobile/leaderboard/activity?limit=${limit}&days=${days}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Handle API response format: { success: true, data: {...} }
    if (result.success && result.data) {
      return result.data;
    } else {
      throw new Error(result.error || 'Invalid API response format');
    }
  } catch (error) {
    console.error('Error fetching activity leaderboard:', error);
    // Return mock data for development
    return getMockActivityLeaderboard();
  }
}

/**
 * Mock data for development/fallback
 */
function getMockLeaderboard(): LeaderboardResponse {
  const mockUsers: LeaderboardUser[] = [
    {
      id: '1',
      name: 'Kim Min-jun',
      email: 'minjun@example.com',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      xp: 15420,
      level: 15,
      currentStreak: 45,
      maxStreak: 67,
      rank: 1
    },
    {
      id: '2',
      name: 'Lee Seo-yun',
      email: 'seoyun@example.com',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b10cd494?w=150&h=150&fit=crop&crop=face',
      xp: 14850,
      level: 14,
      currentStreak: 32,
      maxStreak: 45,
      rank: 2
    },
    {
      id: '3',
      name: 'Park Ji-hoon',
      email: 'jihoon@example.com',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      xp: 13290,
      level: 13,
      currentStreak: 28,
      maxStreak: 38,
      rank: 3
    },
    {
      id: '4',
      name: 'Choi Ye-jin',
      email: 'yejin@example.com',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      xp: 12760,
      level: 12,
      currentStreak: 15,
      maxStreak: 42,
      rank: 4
    },
    {
      id: '5',
      name: 'Jung Ho-seok',
      email: 'hoseok@example.com',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      xp: 11980,
      level: 11,
      currentStreak: 22,
      maxStreak: 31,
      rank: 5
    },
    {
      id: '6',
      name: 'Han So-young',
      email: 'soyoung@example.com',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      xp: 10420,
      level: 10,
      currentStreak: 8,
      maxStreak: 25,
      rank: 6
    },
    {
      id: '7',
      name: 'Yoon Tae-hyung',
      email: 'taehyung@example.com',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
      xp: 9850,
      level: 9,
      currentStreak: 12,
      maxStreak: 28,
      rank: 7
    },
    {
      id: '8',
      name: 'Lim Na-eun',
      email: 'naeun@example.com',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
      xp: 8990,
      level: 8,
      currentStreak: 5,
      maxStreak: 19,
      rank: 8
    },
    {
      id: '9',
      name: 'Kang Min-ho',
      email: 'minho@example.com',
      image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face',
      xp: 8340,
      level: 8,
      currentStreak: 18,
      maxStreak: 22,
      rank: 9
    },
    {
      id: '10',
      name: 'Oh Hyun-jung',
      email: 'hyunjung@example.com',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      xp: 7820,
      level: 7,
      currentStreak: 3,
      maxStreak: 15,
      rank: 10
    }
  ];

  return {
    users: mockUsers,
    currentUser: {
      id: 'current',
      name: 'You',
      email: 'you@example.com',
      xp: 6540,
      level: 6,
      currentStreak: 7,
      maxStreak: 12,
      rank: 15
    },
    totalUsers: 127
  };
}

function getMockStreakLeaderboard(): LeaderboardResponse {
  const mockUsers: LeaderboardUser[] = [
    {
      id: '1',
      name: 'Kim Min-jun',
      email: 'minjun@example.com',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      xp: 15420,
      level: 15,
      currentStreak: 67,
      maxStreak: 67,
      rank: 1
    },
    {
      id: '2',
      name: 'Park Ji-hoon',
      email: 'jihoon@example.com',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      xp: 13290,
      level: 13,
      currentStreak: 45,
      maxStreak: 45,
      rank: 2
    },
    {
      id: '3',
      name: 'Lee Seo-yun',
      email: 'seoyun@example.com',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b10cd494?w=150&h=150&fit=crop&crop=face',
      xp: 14850,
      level: 14,
      currentStreak: 42,
      maxStreak: 45,
      rank: 3
    }
  ];

  return {
    users: mockUsers.slice(0, 10),
    currentUser: {
      id: 'current',
      name: 'You',
      email: 'you@example.com',
      xp: 6540,
      level: 6,
      currentStreak: 7,
      maxStreak: 12,
      rank: 25
    },
    totalUsers: 127
  };
}

function getMockActivityLeaderboard(): LeaderboardResponse {
  const mockUsers: LeaderboardUser[] = [
    {
      id: '1',
      name: 'Choi Ye-jin',
      email: 'yejin@example.com',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      xp: 12760,
      level: 12,
      currentStreak: 15,
      maxStreak: 42,
      rank: 1
    },
    {
      id: '2',
      name: 'Jung Ho-seok',
      email: 'hoseok@example.com',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      xp: 11980,
      level: 11,
      currentStreak: 22,
      maxStreak: 31,
      rank: 2
    }
  ];

  return {
    users: mockUsers.slice(0, 10),
    currentUser: {
      id: 'current',
      name: 'You',
      email: 'you@example.com',
      xp: 6540,
      level: 6,
      currentStreak: 7,
      maxStreak: 12,
      rank: 18
    },
    totalUsers: 127
  };
}

// Export configuration
export const leaderboardApi = {
  getXPLeaderboard,
  getStreakLeaderboard,
  getActivityLeaderboard,
};

export default leaderboardApi;