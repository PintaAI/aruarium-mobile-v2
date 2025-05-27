import { View } from 'react-native';
import { VocabularyList } from '~/components/vocabulary/vocabulary-list';
import { useRouter } from 'expo-router';

export default function Vocab() {
  const router = useRouter();

  const handleCollectionPress = (collectionId: number) => {
    // TODO: Navigate to collection detail screen
    console.log('Navigate to collection:', collectionId);
  };

  return (
    <View className="flex-1">
      <VocabularyList onVocabPress={handleCollectionPress} />
    </View>
  );
}
