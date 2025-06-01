import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useQuery } from '@tanstack/react-query';
import { getCourse } from '~/lib/api/courses';
import { CourseDetail } from '../../components/course/course-detail';
import { Text } from '~/components/ui/text';
import { useColorScheme } from '~/lib/useColorScheme';

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const courseId = parseInt(id as string, 10);
  const { isDarkColorScheme } = useColorScheme();

  const {
    data: course,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourse(courseId),
    enabled: !isNaN(courseId),
  });

  if (isNaN(courseId)) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Stack.Screen options={{ title: 'Invalid Course' }} />
        <Text className="text-lg text-destructive">Invalid course ID</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Stack.Screen options={{ title: 'Loading...' }} />
        <ActivityIndicator size="large" className="text-primary" />
        <Text className="mt-4 text-muted-foreground">Loading course...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Stack.Screen options={{ title: 'Error' }} />
        <Text className="text-lg text-destructive mb-4">Failed to load course</Text>
        <Text className="text-muted-foreground text-center mb-4">
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </Text>
      </View>
    );
  }

  if (!course) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Stack.Screen options={{ title: 'Not Found' }} />
        <Text className="text-lg text-destructive">Course not found</Text>
      </View>
    );
  }

  return (
    <>
      
      <Stack.Screen 
        options={{ 
          headerShown: false,
        }} 
      />
      <View className="flex-1 bg-background">
        <CourseDetail course={course} onRefresh={refetch} />
      </View>
    </>
  );
}
