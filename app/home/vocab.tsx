import { View } from 'react-native';

import { VocabularyList } from '~/components/vocabulary/vocabulary-list';
import { useRouter } from 'expo-router';

export default function Vocab() {
  const router = useRouter();

  const handleVocabPress = (vocabId: string) => {
    // TODO: Navigate to vocabulary detail screen
    console.log('Navigate to vocabulary:', vocabId);
  };

  return (
    <View className="flex-1">
      <VocabularyList onVocabPress={handleVocabPress} />
    </View>
  );
}
