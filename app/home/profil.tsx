import { View, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import { Trophy, Medal, Zap, TrendingUp, Users, Crown, Star } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { getCurrentUser, UserInfo } from '~/lib/auth';
import { getXPLeaderboard, getStreakLeaderboard, getActivityLeaderboard, LeaderboardResponse, LeaderboardUser } from '~/lib/api/leaderboard';
import { iconWithClassName } from '~/lib/icons/iconWithClassName';
import { ActivityLogViewer } from '~/components/ActivityLogViewer';

const TrophyIcon = iconWithClassName(Trophy);
const MedalIcon = iconWithClassName(Medal);
const ZapIcon = iconWithClassName(Zap);
const TrendingUpIcon = iconWithClassName(TrendingUp);
const UsersIcon = iconWithClassName(Users);
const CrownIcon = iconWithClassName(Crown);
const StarIcon = iconWithClassName(Star);

type LeaderboardType = 'xp' | 'streak' | 'activity' | 'feed';

const LEADERBOARD_TABS = [
  
  {
    key: 'xp' as LeaderboardType,
    title: 'XP Leaders',
    icon: TrophyIcon,
    description: 'Top XP earners'
  },
    {
    key: 'feed' as LeaderboardType,
    title: 'Live Feed',
    icon: UsersIcon,
    description: 'Global activity'
  },
  {
    key: 'streak' as LeaderboardType,
    title: 'Streak Masters',
    icon: ZapIcon,
    description: 'Longest streaks'
  },
  {
    key: 'activity' as LeaderboardType,
    title: 'Most Active',
    icon: TrendingUpIcon,
    description: 'Activity champions'
  },

];

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return { icon: CrownIcon, color: 'text-yellow-500' };
    case 2:
      return { icon: MedalIcon, color: 'text-gray-400' };
    case 3:
      return { icon: MedalIcon, color: 'text-orange-600' };
    default:
      return { icon: StarIcon, color: 'text-primary' };
  }
}

function getRankBadgeColor(rank: number) {
  switch (rank) {
    case 1:
      return 'bg-yellow-500';
    case 2:
      return 'bg-gray-400';
    case 3:
      return 'bg-orange-600';
    default:
      return 'bg-primary';
  }
}

export default function Leaderboard() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<LeaderboardType>('xp');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardResponse | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Fetch user information and leaderboard data
  useEffect(() => {
    async function fetchData() {
      try {
        const user = await getCurrentUser();
        setUserInfo(user);
        await fetchLeaderboardData(activeTab);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Fetch leaderboard data when tab changes
  useEffect(() => {
    if (!loading && activeTab !== 'feed') {
      fetchLeaderboardData(activeTab);
    }
  }, [activeTab]);

  const fetchLeaderboardData = async (type: LeaderboardType) => {
    if (type === 'feed') return; // No need to fetch for activity feed
    
    try {
      setRefreshing(true);
      let data: LeaderboardResponse;
      
      switch (type) {
        case 'xp':
          data = await getXPLeaderboard();
          break;
        case 'streak':
          data = await getStreakLeaderboard();
          break;
        case 'activity':
          data = await getActivityLeaderboard();
          break;
        default:
          data = await getXPLeaderboard();
      }
      
      setLeaderboardData(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setRefreshing(false);
    }
  };
  
  const getMetricValue = (user: LeaderboardUser) => {
    switch (activeTab) {
      case 'xp':
        return `${user.xp.toLocaleString()} XP`;
      case 'streak':
        return `${user.currentStreak} days`;
      case 'activity':
        return user.activityCount ? `${user.activityCount} activities` : `Level ${user.level}`;
      default:
        return `${user.xp.toLocaleString()} XP`;
    }
  };

  const getMetricLabel = () => {
    switch (activeTab) {
      case 'xp':
        return 'Experience Points';
      case 'streak':
        return 'Current Streak';
      case 'activity':
        return 'Recent Activities';
      default:
        return 'Experience Points';
    }
  };
  
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-muted-foreground">Loading leaderboard...</Text>
      </View>
    );
  }
  
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {/* Header */}
      <View className="items-center pt-8 pb-6 gap-3 bg-gradient-to-b from-primary/5 to-transparent">
        <View className="w-16 h-16 rounded-full items-center justify-center bg-primary/10">
          <TrophyIcon size={32} className="text-primary" />
        </View>
        <View className="items-center">
          <Text className="text-2xl font-bold">Global Leaderboard</Text>
          <Text className="text-sm text-muted-foreground">Compete with learners worldwide</Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View className="px-4 mb-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
          <View className="flex-row gap-2">
            {LEADERBOARD_TABS.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                className={`px-4 py-3 rounded-full flex-row items-center gap-2 ${
                  activeTab === tab.key
                    ? 'bg-primary'
                    : 'bg-secondary/20'
                }`}
              >
                <tab.icon
                  size={16}
                  className={activeTab === tab.key ? 'text-primary-foreground' : 'text-foreground'}
                />
                <Text
                  className={`font-medium ${
                    activeTab === tab.key ? 'text-primary-foreground' : 'text-foreground'
                  }`}
                >
                  {tab.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Current User Stats */}
      {leaderboardData?.currentUser && activeTab !== 'feed' && (
        <View className="px-4 mb-4">
          <Card className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5">
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
                <Text className="font-bold text-primary">#{leaderboardData.currentUser.rank}</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold">Your Position</Text>
                <Text className="text-sm text-muted-foreground">
                  {getMetricValue(leaderboardData.currentUser)} • {getMetricLabel()}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-xs text-muted-foreground">Level</Text>
                <Text className="font-bold text-lg">{leaderboardData.currentUser.level}</Text>
              </View>
            </View>
          </Card>
        </View>
      )}

      {/* Content */}
      {activeTab === 'feed' ? (
        /* Activity Feed */
        <ActivityLogViewer />
      ) : (
        /* Leaderboard */
        <View className="px-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="font-semibold text-lg">Top Learners</Text>
            <TouchableOpacity
              onPress={() => fetchLeaderboardData(activeTab)}
              disabled={refreshing}
              className="p-2 rounded-lg bg-secondary/20"
            >
              {refreshing ? (
                <ActivityIndicator size="small" />
              ) : (
                <TrendingUpIcon size={16} className="text-foreground" />
              )}
            </TouchableOpacity>
          </View>

          <Card className="divide-y divide-border">
            {leaderboardData?.users.map((user, index) => {
              const rankInfo = getRankIcon(user.rank);
              const badgeColor = getRankBadgeColor(user.rank);
              
              return (
                <View key={user.id} className="p-4 flex-row items-center gap-3">
                  {/* Rank */}
                  <View className={`w-8 h-8 rounded-full items-center justify-center ${badgeColor}`}>
                    {user.rank <= 3 ? (
                      <rankInfo.icon size={16} className="text-white" />
                    ) : (
                      <Text className="text-white font-bold text-sm">#{user.rank}</Text>
                    )}
                  </View>

                  {/* Avatar */}
                  <View className="w-10 h-10 rounded-full overflow-hidden bg-secondary">
                    {user.image ? (
                      <Image source={{ uri: user.image }} className="w-full h-full" />
                    ) : (
                      <View className="w-full h-full items-center justify-center bg-primary/10">
                        <UsersIcon size={16} className="text-primary" />
                      </View>
                    )}
                  </View>

                  {/* User Info */}
                  <View className="flex-1">
                    <Text className="font-medium">{user.name}</Text>
                    <Text className="text-xs text-muted-foreground">
                      Level {user.level} • {getMetricValue(user)}
                    </Text>
                  </View>

                  {/* Stats */}
                  <View className="items-end">
                    <Text className="font-bold text-primary">{getMetricValue(user)}</Text>
                    {activeTab === 'streak' && (
                      <Text className="text-xs text-muted-foreground">
                        Max: {user.maxStreak}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </Card>

          {/* Footer Stats */}
          {leaderboardData && (
            <View className="mt-4 p-4 bg-secondary/10 rounded-lg">
              <Text className="text-center text-sm text-muted-foreground">
                🌟 {leaderboardData.totalUsers} learners competing globally
              </Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}
