import { ScrollView } from 'react-native';
import { CourseCard, type CourseData } from './course-card';

const mockCourses: CourseData[] = [
  {
    id: '1',
    title: 'Korean Alphabet (한글)',
    description: 'Master Hangul, the Korean writing system. Learn to read and write Korean characters with proper pronunciation.',
    level: 'Beginner',
    duration: '2 weeks',
    totalLessons: 14,
    completedLessons: 0,
    thumbnailUrl: 'https://picsum.photos/800/400?random=1',
  },
  {
    id: '2',
    title: 'Basic Conversations',
    description: 'Learn essential Korean phrases and vocabulary for everyday conversations. Perfect for beginners.',
    level: 'Beginner',
    duration: '4 weeks',
    totalLessons: 20,
    completedLessons: 0,
    thumbnailUrl: 'https://picsum.photos/800/400?random=2',
  },
  {
    id: '3',
    title: 'Grammar Fundamentals',
    description: 'Understanding Korean sentence structure and basic grammar patterns. Build a strong foundation.',
    level: 'Intermediate',
    duration: '6 weeks',
    totalLessons: 24,
    completedLessons: 0,
    thumbnailUrl: 'https://picsum.photos/800/400?random=3',
  },
  {
    id: '4',
    title: 'Korean Culture & Customs',
    description: 'Dive into Korean culture, traditions, and social etiquette while improving your language skills.',
    level: 'Intermediate',
    duration: '3 weeks',
    totalLessons: 15,
    completedLessons: 0,
    thumbnailUrl: 'https://picsum.photos/800/400?random=4',
  },
];

interface CourseListProps {
  onCoursePress?: (courseId: string) => void;
}

export function CourseList({ onCoursePress }: CourseListProps) {
  return (
    <ScrollView 
      className="flex-1 bg-accent/50 p-6"
      showsVerticalScrollIndicator={false}
    >
      {mockCourses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onPress={onCoursePress}
        />
      ))}
    </ScrollView>
  );
}
