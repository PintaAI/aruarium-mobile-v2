import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';

export interface VocabularyData {
  id: string;
  word: string;
  pronunciation: string;
  meaning: string;
  example: string;
  exampleMeaning: string;
  category: string;
  thumbnailUrl: string;
  level: string;
}

interface VocabularyCardProps {
  vocabulary: VocabularyData;
  onPress?: (vocabId: string) => void;
}

export function VocabularyCard({ vocabulary, onPress }: VocabularyCardProps) {
  return (
    <Card className="mb-4 overflow-hidden">
      <TouchableOpacity
        className="w-full"
        onPress={() => onPress?.(vocabulary.id)}
        accessibilityRole="button"
        accessibilityLabel={`Vocabulary: ${vocabulary.word}`}
      >
        <Image
          source={{ uri: vocabulary.thumbnailUrl }}
          className="w-full h-32"
          resizeMode="cover"
        />
        <View className="p-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-base font-medium">{vocabulary.word}</Text>
            <View className="bg-primary/10 px-2 py-1 rounded-full">
              <Text className="text-xs">{vocabulary.level}</Text>
            </View>
          </View>
          <Text className="text-sm text-foreground/80 mb-1">
            {vocabulary.pronunciation}
          </Text>
          <Text className="text-sm mb-3">{vocabulary.meaning}</Text>
          <View className="bg-primary/5 rounded-lg p-3 my-1">
            <Text className="text-xs mb-1">{vocabulary.example}</Text>
            <Text className="text-xs text-foreground/70">{vocabulary.exampleMeaning}</Text>
          </View>
          <Text className="text-xs text-foreground/60 mt-2">{vocabulary.category}</Text>
        </View>
      </TouchableOpacity>
    </Card>
  );
}
