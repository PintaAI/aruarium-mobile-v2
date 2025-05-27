import { View } from 'react-native';
import { CourseList } from '~/components/course/course-list';
import { useRouter } from 'expo-router';

export default function Course() {
  const router = useRouter();

  const handleCoursePress = (courseId: string) => {
    // TODO: Navigate to course detail screen
    console.log('Navigate to course:', courseId);
  };

  return (
    <View className="flex-1">
      <CourseList onCoursePress={handleCoursePress} />
    </View>
  );
}
