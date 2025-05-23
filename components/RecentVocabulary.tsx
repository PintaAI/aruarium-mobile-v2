import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';

interface VocabWord {
  id: number;
  korean: string;
  indonesian: string;
  category: string;
  learned: string;
}

const recentWords: VocabWord[] = [
  {
    id: 1,
    korean: '학교',
    indonesian: 'Sekolah',
    category: 'Places',
    learned: '1 hour ago'
  },
  {
    id: 2,
    korean: '음식',
    indonesian: 'Makanan',
    category: 'Daily Life',
    learned: '3 hours ago'
  },
  {
    id: 3,
    korean: '가족',
    indonesian: 'Keluarga',
    category: 'Family',
    learned: '5 hours ago'
  },
  {
    id: 4,
    korean: '친구',
    indonesian: 'Teman',
    category: 'Relationships',
    learned: 'Yesterday'
  }
];

export function RecentVocabulary() {
  return (
    <View className="w-full">
      <Text className="text-xl font-bold mb-4">Recently Learned</Text>
      <View className="flex flex-row flex-wrap gap-3">
        {recentWords.map((word) => (
          <Card key={word.id} className="flex-1 min-w-[45%] p-3">
            <View className="flex gap-1">
              <Text className="text-lg font-bold">{word.korean}</Text>
              <Text className="text-foreground/80">{word.indonesian}</Text>
              <View className="flex-row gap-2 items-center mt-1">
                <Text className="text-xs bg-primary/10 px-2 py-1 rounded-full">
                  {word.category}
                </Text>
                <Text className="text-xs text-foreground/50">
                  {word.learned}
                </Text>
              </View>
            </View>
          </Card>
        ))}
      </View>
    </View>
  );
}
