import { View, TouchableOpacity } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import type { VocabularyCollection } from '~/lib/api/vocabulary';
import { Book } from 'lucide-react-native';

interface VocabularyCardProps {
  collection: VocabularyCollection;
  onPress?: (collectionId: number) => void;
}

export function VocabularyCard({ collection, onPress }: VocabularyCardProps) {
  return (
    <Card className="mb-4 overflow-hidden">
      <TouchableOpacity
        className="w-full"
        onPress={() => onPress?.(collection.id)}
        accessibilityRole="button"
        accessibilityLabel={`Collection: ${collection.title}`}
      >
        <View className="p-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-medium">{collection.title}</Text>
            <Book className="text-foreground" size={20} />
          </View>
          {collection.description && (
            <Text className="text-sm text-foreground/70 mb-3">{collection.description}</Text>
          )}
          <View className="flex-row gap-2">
            <View className="bg-primary/10 px-2 py-1 rounded-full">
              <Text className="text-xs">{collection.items.length} items</Text>
            </View>
            {!collection.isPublic && (
              <View className="bg-secondary/30 px-2 py-1 rounded-full">
                <Text className="text-xs">Private</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
}
