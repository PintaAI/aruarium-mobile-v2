import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';

interface Course {
  id: number;
  title: string;
  level: string;
  progress: number;
  lastAccessed: string;
}

const mockCourses: Course[] = [
  {
    id: 1,
    title: 'Basic Korean Conversation',
    level: 'Beginner',
    progress: 60,
    lastAccessed: '2 hours ago'
  },
  {
    id: 2,
    title: 'Korean Grammar Essentials',
    level: 'Intermediate',
    progress: 30,
    lastAccessed: 'Yesterday'
  },
  {
    id: 3,
    title: 'TOPIK I Preparation',
    level: 'Intermediate',
    progress: 45,
    lastAccessed: '3 days ago'
  }
];

export function RecentCourses() {
  return (
    <View className="w-full">
      <Text className="text-xl font-bold mb-4">Recent Courses</Text>
      <View className="flex gap-3">
        {mockCourses.map((course) => (
          <Card key={course.id} className="w-full p-4 flex-row items-center justify-between">
            <View className="flex gap-1">
              <Text className="font-semibold">{course.title}</Text>
              <Text className="text-sm text-foreground/70">{course.level}</Text>
              <Text className="text-xs text-foreground/50">Last accessed: {course.lastAccessed}</Text>
            </View>
            <View className="h-12 w-12 bg-primary/10 rounded-full items-center justify-center">
              <Text className="font-bold">{course.progress}%</Text>
            </View>
          </Card>
        ))}
      </View>
    </View>
  );
}
