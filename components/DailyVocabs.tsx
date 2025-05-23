import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';

interface Vocabulary {
  id: number;
  korean: string;
  indonesian: string;
}

const mockVocabs: Vocabulary[] = [
  {
    id: 1,
    korean: '안녕하세요',
    indonesian: 'Halo/Selamat pagi'
  },
  {
    id: 2,
    korean: '감사합니다',
    indonesian: 'Terima kasih'
  },
  {
    id: 3,
    korean: '사랑해요',
    indonesian: 'Aku cinta kamu'
  },
  {
    id: 4,
    korean: '잘 자요',
    indonesian: 'Selamat tidur'
  },
  {
    id: 5,
    korean: '맛있어요',
    indonesian: 'Enak/Lezat'
  }
];

export function DailyVocabs() {
  return (
    <View className="w-full pb-3">
      <Text className="text-xl font-bold mb-4">Daily Korean Vocabulary</Text>
      <Card className="w-full p-4">
        <View className="flex gap-3">
          {mockVocabs.map((vocab) => (
            <View 
              key={vocab.id} 
              className="bg-primary/10 p-3 rounded-lg my-1"
            >
              <Text className="font-semibold text-base">{vocab.korean}</Text>
              <Text className="text-foreground/80 text-sm mt-1">{vocab.indonesian}</Text>
            </View>
          ))}
        </View>
      </Card>
    </View>
  );
}
