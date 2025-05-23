import { ScrollView } from 'react-native';
import { VocabularyCard, type VocabularyData } from './vocabulary-card';

const mockVocabulary: VocabularyData[] = [
  {
    id: '1',
    word: '안녕하세요',
    pronunciation: 'annyeonghaseyo',
    meaning: 'Hello (formal)',
    example: '안녕하세요, 저는 민수입니다.',
    exampleMeaning: 'Hello, I am Minsu.',
    category: 'Greetings',
    level: 'Beginner',
    thumbnailUrl: 'https://picsum.photos/800/400?random=5',
  },
  {
    id: '2',
    word: '감사합니다',
    pronunciation: 'gamsahamnida',
    meaning: 'Thank you (formal)',
    example: '도와주셔서 감사합니다.',
    exampleMeaning: 'Thank you for helping me.',
    category: 'Common Phrases',
    level: 'Beginner',
    thumbnailUrl: 'https://picsum.photos/800/400?random=6',
  },
  {
    id: '3',
    word: '사랑해요',
    pronunciation: 'saranghaeyo',
    meaning: 'I love you',
    example: '너무 사랑해요.',
    exampleMeaning: 'I love you so much.',
    category: 'Expressions',
    level: 'Beginner',
    thumbnailUrl: 'https://picsum.photos/800/400?random=7',
  },
  {
    id: '4',
    word: '맛있다',
    pronunciation: 'masitda',
    meaning: 'Delicious',
    example: '이 음식이 정말 맛있어요.',
    exampleMeaning: 'This food is really delicious.',
    category: 'Food & Dining',
    level: 'Beginner',
    thumbnailUrl: 'https://picsum.photos/800/400?random=8',
  },
];

interface VocabularyListProps {
  onVocabPress?: (vocabId: string) => void;
}

export function VocabularyList({ onVocabPress }: VocabularyListProps) {
  return (
    <ScrollView 
      className="flex-1  bg-secondary/50 p-6"
      showsVerticalScrollIndicator={false}
    >
      {mockVocabulary.map((vocab) => (
        <VocabularyCard
          key={vocab.id}
          vocabulary={vocab}
          onPress={onVocabPress}
        />
      ))}
    </ScrollView>
  );
}
