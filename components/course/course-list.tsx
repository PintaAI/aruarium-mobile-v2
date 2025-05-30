import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import { CourseCard, type CourseData } from './course-card';

interface CourseListProps {
  onCoursePress?: (courseId: string) => void;
  courses: CourseData[];
  loading: boolean; // loading is now a prop
  error: string | null; // error is now a prop
}

export function CourseList({
  onCoursePress,
  courses,
  loading,
  error,
}: CourseListProps) {
  // Loading and error states are now handled by the parent component (Course.tsx)
  // Data fetching logic is also moved to the parent component

  // The component now directly renders based on the passed props
  if (courses.length === 0 && !loading && !error) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Card className="p-4 bg-background w-full">
          <Text className="text-foreground/60 text-center text-lg">
            No courses available at the moment.
          </Text>
        </Card>
      </View>
    );
  }

  // Render individual course cards
  // The ScrollView will be in the parent component
  return (
    <View className="gap-4">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onPress={onCoursePress}
        />
      ))}
    </View>
  );
}
