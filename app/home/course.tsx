import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import { CourseList } from '~/components/course/course-list';
import { type CourseData } from '~/components/course/course-card';
import { courseApi } from '~/lib/api/courses';
import { Course as ApiCourse } from '~/lib/api/types'; // Renamed to avoid conflict
import { useRouter } from 'expo-router';

// Helper function to format level (can be moved to a utils file if used elsewhere)
function formatLevel(level: string): string {
  if (!level) return 'N/A';
  return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
}

export default function Course() {
  const router = useRouter();
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCoursesData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const apiCourses = await courseApi.getAvailableCourses();
      const formattedCourses: CourseData[] = apiCourses.map((course: ApiCourse) => ({
        id: course.id.toString(),
        title: course.title,
        description: course.description || 'No description available.',
        level: formatLevel(course.level),
        totalLessons: course.totalModules,
        completedLessons: 0, // Placeholder
        thumbnailUrl: course.thumbnail || `https://picsum.photos/seed/${course.id}/800/400`,
      }));
      setCourses(formattedCourses);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      setError('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCoursesData();
  }, []);

  const handleRefresh = () => {
    fetchCoursesData(true);
  };

  const handleCoursePress = (courseId: string) => {
    console.log('Navigate to course:', courseId);
    router.push(`/courses/${courseId}`);
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-accent/50 p-6">
        <ActivityIndicator size="large" className="text-primary" />
        <Text className="text-foreground/60 mt-2">Loading courses...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-accent/50 p-6">
        <Card className="p-4 bg-background w-full">
          <Text className="text-destructive text-center text-lg">{error}</Text>
        </Card>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-accent/50">
       {/* Optional Header if needed */}
      {/* <View className="p-4 border-b border-border bg-background">
        <Text className="text-2xl font-bold text-foreground">Available Courses</Text>
      </View> */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 120 }} // Adjusted padding
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <CourseList
          courses={courses}
          onCoursePress={handleCoursePress}
          loading={loading && refreshing} // Pass loading only if it's not a refresh background load
          error={error}
        />
      </ScrollView>
    </View>
  );
}
