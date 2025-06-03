import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { fetchWithAuth } from '~/lib/auth';
import { API_BASE_URL } from '~/lib/config';

interface ActivityLogEntry {
  id: string;
  userId: string;
  type: string;
  description: string | null;
  previousStreak: number | null;
  newStreak: number | null;
  xpEarned: number | null;
  createdAt: string;
  user?: {
    name?: string;
    email?: string;
  };
}

interface ActivityLogResponse {
  success: boolean;
  data: ActivityLogEntry[];
  total: number;
  page: number;
  limit: number;
}

export function ActivityLogViewer() {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchLogs = async (pageNum: number = 1, isRefresh: boolean = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await fetchWithAuth(
        `${API_BASE_URL}/api/mobile/streak/logs?page=${pageNum}&limit=20`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch logs: ${response.status}`);
      }

      const data: ActivityLogResponse = await response.json();

      if (data.success) {
        if (isRefresh || pageNum === 1) {
          setLogs(data.data);
        } else {
          setLogs(prev => [...prev, ...data.data]);
        }
        setHasMore(data.data.length === 20); // Assuming limit is 20
        setPage(pageNum);
      } else {
        throw new Error('Failed to fetch activity logs');
      }
    } catch (err) {
      console.error('Error fetching activity logs:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, []);

  const handleRefresh = () => {
    fetchLogs(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchLogs(page + 1);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'Just now';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'LOGIN': return '🚪';
      case 'COMPLETE_MODULE': return '📚';
      case 'COMPLETE_COURSE': return '🎓';
      case 'COMPLETE_QUIZ': return '📝';
      case 'VOCABULARY_PRACTICE': return '📖';
      case 'DAILY_CHALLENGE': return '🎯';
      case 'SUBMIT_ASSIGNMENT': return '📋';
      case 'PARTICIPATE_LIVE_SESSION': return '📺';
      case 'PLAY_GAME': return '🎮';
      default: return '⭐';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'LOGIN': return 'text-blue-500';
      case 'COMPLETE_MODULE': return 'text-green-500';
      case 'COMPLETE_COURSE': return 'text-purple-500';
      case 'COMPLETE_QUIZ': return 'text-orange-500';
      case 'VOCABULARY_PRACTICE': return 'text-pink-500';
      case 'DAILY_CHALLENGE': return 'text-red-500';
      case 'SUBMIT_ASSIGNMENT': return 'text-indigo-500';
      case 'PARTICIPATE_LIVE_SESSION': return 'text-cyan-500';
      case 'PLAY_GAME': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  if (error) {
    return (
      <Card className="p-4 m-4">
        <Text className="text-destructive text-center mb-4">Error: {error}</Text>
        <Button onPress={() => fetchLogs(1)} variant="outline">
          <Text>Retry</Text>
        </Button>
      </Card>
    );
  }

  return (
    <View className="flex-1">
      <Card className="m-4 p-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-semibold">🌍 Global Activity Feed</Text>
          <Text className="text-sm text-muted-foreground">{logs.length} activities</Text>
        </View>

        <ScrollView
          className="max-h-96"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onMomentumScrollEnd={(event) => {
            const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
            const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
            if (isCloseToBottom) {
              handleLoadMore();
            }
          }}
        >
          {logs.length === 0 && !loading ? (
            <Text className="text-center text-muted-foreground py-8">
              No activity logs found
            </Text>
          ) : (
            <View className="gap-3">
              {logs.map((log) => (
                <View key={log.id} className="border border-border rounded-lg p-3">
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-row items-center gap-2 flex-1">
                      <Text className="text-lg">{getActivityIcon(log.type)}</Text>
                      <View className="flex-1">
                        <Text className="font-medium text-sm">
                          {log.user?.name || log.user?.email?.split('@')[0] || `User ${log.userId.slice(-4)}`}
                        </Text>
                        <Text className={`text-xs ${getActivityColor(log.type)}`}>
                          {log.type.replace(/_/g, ' ')}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-xs text-muted-foreground">
                      {formatDate(log.createdAt)}
                    </Text>
                  </View>

                  {log.description && (
                    <Text className="text-sm text-muted-foreground mb-2">
                      {log.description}
                    </Text>
                  )}

                  <View className="flex-row items-center gap-4">
                    {log.xpEarned !== null && log.xpEarned > 0 && (
                      <View className="flex-row items-center gap-1">
                        <Text className="text-purple-500">💎</Text>
                        <Text className="text-xs font-medium text-purple-500">
                          +{log.xpEarned} XP
                        </Text>
                      </View>
                    )}
                    
                    {log.newStreak !== null && log.previousStreak !== null && log.newStreak > log.previousStreak && (
                      <View className="flex-row items-center gap-1">
                        <Text className="text-orange-500">🔥</Text>
                        <Text className="text-xs font-medium text-orange-500">
                          {log.previousStreak} → {log.newStreak}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {loading && (
            <View className="py-4 items-center">
              <ActivityIndicator size="small" />
              <Text className="text-xs text-muted-foreground mt-2">Loading...</Text>
            </View>
          )}
        </ScrollView>

        {hasMore && !loading && (
          <Button 
            variant="outline" 
            className="mt-4"
            onPress={handleLoadMore}
          >
            <Text>Load More</Text>
          </Button>
        )}
      </Card>
    </View>
  );
}