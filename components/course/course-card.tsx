import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';

export interface CourseData {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  totalLessons: number;
  completedLessons: number;
  thumbnailUrl: string;
}

interface CourseCardProps {
  course: CourseData;
  onPress?: (courseId: string) => void;
}

export function CourseCard({ course, onPress }: CourseCardProps) {
  return (
    <Card className="mb-4 overflow-hidden">
      <TouchableOpacity
        className="w-full"
        onPress={() => onPress?.(course.id)}
        accessibilityRole="button"
        accessibilityLabel={`Course: ${course.title}`}
      >
        <Image
          source={{ uri: course.thumbnailUrl }}
          className="w-full h-36"
          resizeMode="cover"
        />
        <View className="p-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-base font-medium">{course.title}</Text>
            <Text className="text-xs text-foreground/70">{course.level}</Text>
          </View>
          <Text className="text-sm text-foreground/80 mb-3">{course.description}</Text>
          <View className="flex-row justify-between items-center">
            <Text className="text-xs text-foreground/70">{course.duration}</Text>
            <View className="bg-primary/10 px-2 py-1 rounded-full">
              <Text className="text-xs">
                {course.completedLessons}/{course.totalLessons}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
}
