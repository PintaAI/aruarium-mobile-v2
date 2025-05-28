import { View } from 'react-native';
import { VocabularyList } from '~/components/vocabulary/vocabulary-list';

export default function Vocab() {
  const handleCollectionPress = (collectionId: number) => {
    // Simple logging for now - can be extended later for navigation
    console.log('Collection pressed:', collectionId);
  };

  return (
    <View className="flex-1">
      <VocabularyList onVocabPress={handleCollectionPress} />
    </View>
  );
}
