import { View, ActivityIndicator, ScrollView } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import { useEffect, useState } from 'react';
import { courseApi } from '~/lib/api/courses';
import { Course } from '~/lib/api/types';

// Helper function to format relative time
function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}

// Helper function to format level
function formatLevel(level: string): string {
  if (!level) return '';
  return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
}

export function RecentCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecentCourses() {
      try {
        setLoading(true);
        setError(null);

        // Fetch joined courses, sort by update date (most recent first), and limit
        const joinedCourses = await courseApi.getJoinedCourses();
        const sortedCourses = joinedCourses
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 5); // Show up to 5 recent courses
        
        setCourses(sortedCourses);
      } catch (err) {
        console.error('Failed to fetch recent courses:', err);
        setError('Failed to load recent courses');
      } finally {
        setLoading(false);
      }
    }

    fetchRecentCourses();
  }, []);

  if (loading) {
    return (
      <View className="w-full">
        <Text className="text-xl font-bold mb-4">Recent Courses</Text>
        <View className="flex items-center justify-center py-8">
          <ActivityIndicator size="large" className="text-primary" />
          <Text className="text-foreground/60 mt-2">Loading courses...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="w-full">
        <Text className="text-xl font-bold mb-4">Recent Courses</Text>
        <Card className="p-4">
          <Text className="text-destructive text-center">{error}</Text>
          <Text className="text-foreground/60 text-center text-sm mt-1">
            Pull to refresh to try again
          </Text>
        </Card>
      </View>
    );
  }

  if (courses.length === 0) {
    return (
      <View className="w-full">
        <Text className="text-xl font-bold mb-4">Recent Courses</Text>
        <Card className="p-4">
          <Text className="text-foreground/60 text-center">
            No recent courses
          </Text>
          <Text className="text-foreground/40 text-center text-sm mt-1">
            Join a course to see it here
          </Text>
        </Card>
      </View>
    );
  }

  return (
    <View className="w-full">
      <Text className="text-xl font-bold mb-4">Recent Courses</Text>
      <View className="flex gap-3">
        {courses.map((course) => (
          <Card key={course.id} className="w-full p-4 flex-row items-center justify-between">
            <View className="flex gap-1 flex-1">
              <Text className="font-semibold native:text-lg" numberOfLines={1}>{course.title}</Text>
              <Text className="text-sm text-foreground/70">{formatLevel(course.level)}</Text>
              <Text className="text-xs text-foreground/50">
                Last updated: {formatRelativeTime(course.updatedAt)}
              </Text>
            </View>
            {/* You might want to add a progress indicator here if available */}
            {/* For now, let's show total modules as an example */}
            <View className="h-12 w-12 bg-primary/10 rounded-full items-center justify-center ml-2">
              <Text className="font-bold text-primary">{course.totalModules}</Text>
              <Text className="text-xs text-primary/80">Modules</Text>
            </View>
          </Card>
        ))}
      </View>
    </View>
  );
}
