import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import { Clock, BookOpen, Star, CheckCircle } from 'lucide-react-native';
import { iconWithClassName } from '~/lib/icons/iconWithClassName';

const ClockIcon = iconWithClassName(Clock);
const BookOpenIcon = iconWithClassName(BookOpen);
const StarIcon = iconWithClassName(Star);
const CheckCircleIcon = iconWithClassName(CheckCircle);

export interface CourseData {
  id: string;
  title: string;
  description: string;
  level: string;
  duration?: string;
  totalLessons: number;
  completedLessons: number;
  thumbnailUrl: string;
}

interface CourseCardProps {
  course: CourseData;
  onPress?: (courseId: string) => void;
}

function LevelBadge({ level }: { level: string }) {
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'intermediate':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      case 'advanced':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <View className={`px-2 py-1 rounded-full ${getLevelColor(level)}`}>
      <Text className="text-xs font-medium capitalize">{level}</Text>
    </View>
  );
}

function ProgressBar({ completed, total }: { completed: number; total: number }) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  const isCompleted = completed === total && total > 0;

  return (
    <View className="flex-1">
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-xs text-muted-foreground">Progress</Text>
        <Text className="text-xs font-medium">
          {completed}/{total} lessons
        </Text>
      </View>
      <View className="h-2 bg-secondary/30 rounded-full overflow-hidden">
        <View
          className={`h-full rounded-full ${isCompleted ? 'bg-green-500' : 'bg-primary'}`}
          style={{ width: `${percentage}%` }}
        />
      </View>
    </View>
  );
}

export function CourseCard({ course, onPress }: CourseCardProps) {
  const isCompleted = course.completedLessons === course.totalLessons && course.totalLessons > 0;
  const hasStarted = course.completedLessons > 0;

  return (
    <TouchableOpacity
      onPress={() => onPress?.(course.id)}
      accessibilityRole="button"
      accessibilityLabel={`Course: ${course.title}`}
      activeOpacity={0.7}
    >
      <Card className="overflow-hidden border border-border">
        {/* Image Header */}
        <View className="relative">
          <Image
            source={{ uri: course.thumbnailUrl }}
            className="w-full h-40"
            resizeMode="cover"
          />
          
          {/* Overlay badges */}
          <View className="absolute top-3 left-3 right-3 flex-row justify-between items-start">
            <LevelBadge level={course.level} />
            {isCompleted && (
              <View className="bg-green-500 p-1 rounded-full">
                <CheckCircleIcon size={16} className="text-white" />
              </View>
            )}
          </View>

        </View>

        {/* Content */}
        <View className="p-4">
          {/* Title and description */}
          <View className="mb-3">
            <Text className="text-lg font-bold text-foreground mb-1" numberOfLines={2}>
              {course.title}
            </Text>
            <Text className="text-sm text-muted-foreground" numberOfLines={2}>
              {course.description}
            </Text>
          </View>

          {/* Course stats */}
          <View className="flex-row items-center gap-4 mb-3">
            <View className="flex-row items-center">
              <BookOpenIcon size={14} className="text-muted-foreground mr-1" />
              <Text className="text-xs text-muted-foreground">
                {course.totalLessons} lesson{course.totalLessons !== 1 ? 's' : ''}
              </Text>
            </View>
            
            {course.duration && (
              <View className="flex-row items-center">
                <ClockIcon size={14} className="text-muted-foreground mr-1" />
                <Text className="text-xs text-muted-foreground">
                  {course.duration}
                </Text>
              </View>
            )}

            {!hasStarted && (
              <View className="flex-row items-center ml-auto">
                <StarIcon size={14} className="text-primary mr-1" />
                <Text className="text-xs font-medium text-primary">
                  New
                </Text>
              </View>
            )}
          </View>

          {/* Progress bar */}
          <ProgressBar completed={course.completedLessons} total={course.totalLessons} />

          {/* Action hint */}
          <View className="mt-3 pt-3 border-t border-border">
            <Text className="text-xs text-center text-muted-foreground">
              {isCompleted
                ? '✅ Course completed! Tap to review'
                : hasStarted
                  ? '📚 Continue learning'
                  : '🚀 Start learning'}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
