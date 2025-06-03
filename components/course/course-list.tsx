import { View, ActivityIndicator, ScrollView } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { CourseCard, type CourseData } from './course-card';
import { BookOpen, AlertCircle, Trophy, Clock, Users } from 'lucide-react-native';
import { iconWithClassName } from '~/lib/icons/iconWithClassName';
import { useMemo } from 'react';

const BookOpenIcon = iconWithClassName(BookOpen);
const AlertCircleIcon = iconWithClassName(AlertCircle);
const TrophyIcon = iconWithClassName(Trophy);
const ClockIcon = iconWithClassName(Clock);
const UsersIcon = iconWithClassName(Users);

interface CourseListProps {
  onCoursePress?: (courseId: string) => void;
  courses: CourseData[];
  loading: boolean;
  error: string | null;
  onRefresh?: () => void;
}

interface CourseStatsProps {
  courses: CourseData[];
}

function CourseStats({ courses }: CourseStatsProps) {
  const stats = useMemo(() => {
    const totalCourses = courses.length;
    const completedCourses = courses.filter(course =>
      course.completedLessons === course.totalLessons
    ).length;
    const inProgressCourses = courses.filter(course =>
      course.completedLessons > 0 && course.completedLessons < course.totalLessons
    ).length;
    const totalLessons = courses.reduce((sum, course) => sum + course.totalLessons, 0);
    const completedLessons = courses.reduce((sum, course) => sum + course.completedLessons, 0);
    
    return {
      totalCourses,
      completedCourses,
      inProgressCourses,
      progressPercentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
    };
  }, [courses]);

  if (courses.length === 0) return null;

  return (
    <View className="mb-6">
      <View className="flex-row items-center mb-3">
        <BookOpenIcon size={20} className="text-primary mr-2" />
        <Text className="text-lg font-bold">Your Learning Progress</Text>
      </View>
      
      <View className="flex-row gap-3">
        <Card className="flex-1 p-3 bg-blue-50 dark:bg-blue-900/20">
          <View className="items-center">
            <View className="w-8 h-8 rounded-full bg-blue-500/20 items-center justify-center mb-2">
              <BookOpenIcon size={16} className="text-blue-600 dark:text-blue-400" />
            </View>
            <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.totalCourses}
            </Text>
            <Text className="text-xs text-muted-foreground text-center">
              Total Courses
            </Text>
          </View>
        </Card>

        <Card className="flex-1 p-3 bg-green-50 dark:bg-green-900/20">
          <View className="items-center">
            <View className="w-8 h-8 rounded-full bg-green-500/20 items-center justify-center mb-2">
              <TrophyIcon size={16} className="text-green-600 dark:text-green-400" />
            </View>
            <Text className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.completedCourses}
            </Text>
            <Text className="text-xs text-muted-foreground text-center">
              Completed
            </Text>
          </View>
        </Card>

        <Card className="flex-1 p-3 bg-orange-50 dark:bg-orange-900/20">
          <View className="items-center">
            <View className="w-8 h-8 rounded-full bg-orange-500/20 items-center justify-center mb-2">
              <ClockIcon size={16} className="text-orange-600 dark:text-orange-400" />
            </View>
            <Text className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {stats.progressPercentage}%
            </Text>
            <Text className="text-xs text-muted-foreground text-center">
              Progress
            </Text>
          </View>
        </Card>
      </View>
    </View>
  );
}

function LoadingState() {
  return (
    <View className="flex-1 items-center justify-center py-12">
      <ActivityIndicator size="large" className="mb-4" />
      <Text className="text-muted-foreground">Loading courses...</Text>
    </View>
  );
}

function ErrorState({ error, onRefresh }: { error: string; onRefresh?: () => void }) {
  return (
    <View className="flex-1 items-center justify-center p-6">
      <Card className="p-6 w-full items-center">
        <View className="w-16 h-16 rounded-full bg-destructive/10 items-center justify-center mb-4">
          <AlertCircleIcon size={32} className="text-destructive" />
        </View>
        <Text className="text-lg font-semibold mb-2 text-center">
          Something went wrong
        </Text>
        <Text className="text-muted-foreground text-center mb-4">
          {error}
        </Text>
        {onRefresh && (
          <Button onPress={onRefresh} variant="outline">
            <Text>Try Again</Text>
          </Button>
        )}
      </Card>
    </View>
  );
}

function EmptyState() {
  return (
    <View className="flex-1 items-center justify-center p-6">
      <Card className="p-6 w-full items-center">
        <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-4">
          <BookOpenIcon size={32} className="text-primary" />
        </View>
        <Text className="text-lg font-semibold mb-2 text-center">
          No courses yet
        </Text>
        <Text className="text-muted-foreground text-center mb-4">
          Courses will appear here when they become available.
        </Text>
        <View className="flex-row items-center">
          <UsersIcon size={16} className="text-muted-foreground mr-2" />
          <Text className="text-sm text-muted-foreground">
            Check back soon for new content!
          </Text>
        </View>
      </Card>
    </View>
  );
}

export function CourseList({
  onCoursePress,
  courses,
  loading,
  error,
  onRefresh,
}: CourseListProps) {
  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} onRefresh={onRefresh} />;
  }

  // Empty state
  if (courses.length === 0) {
    return <EmptyState />;
  }

  // Success state with courses
  return (
    <View className="flex-1">
      <CourseStats courses={courses} />
      
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-bold">Available Courses</Text>
        <View className="bg-secondary/20 px-3 py-1 rounded-full">
          <Text className="text-sm font-medium text-muted-foreground">
            {courses.length} course{courses.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      <View className="gap-4">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onPress={onCoursePress}
          />
        ))}
      </View>
    </View>
  );
}
