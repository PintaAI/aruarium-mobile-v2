import React from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import { VocabularyCollection } from '~/lib/api/types';
import { Pressable } from 'react-native';
import { Book } from 'lucide-react-native';
import { cssInterop } from 'nativewind';

// Apply cssInterop to icons
[Book].forEach((icon) => {
  cssInterop(icon, {
    className: {
      target: 'style',
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
  });
});

interface VocabularyListProps {
  onVocabPress: (collectionId: number) => void;
  collections: VocabularyCollection[];
  loading: boolean;
  error: string | null;
  refreshing: boolean; // Keep refreshing to pass to RefreshControl if needed, or remove if RefreshControl is fully managed by parent
}

export function VocabularyList({
  onVocabPress,
  collections,
  loading, // loading is now a prop
  error, // error is now a prop
  refreshing, // refreshing is now a prop
}: VocabularyListProps) {
  // Loading and error states are now handled by the parent component (Vocab.tsx)
  // Data fetching logic is also moved to the parent component

  // The component now directly renders based on the passed props
  if (collections.length === 0 && !loading && !error) {
    return (
      <View className="flex-1 justify-center items-center py-12">
        <Book className="w-16 h-16 text-muted-foreground mb-4" />
        <Text className="text-xl font-semibold mb-2">No Public Collections</Text>
        <Text className="text-muted-foreground text-center">
          There are no public vocabulary collections available yet
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-4 pb-[120px]">
      {collections.map((collection) => (
        <Card key={collection.id} className="p-4">
          <Pressable
            onPress={() => onVocabPress(collection.id)}
            className="flex-1"
          >
            <View className="flex-row justify-between items-start mb-3">
              <View className="flex-1 mr-3">
                <Text className="text-lg font-semibold mb-1">
                  {collection.title}
                </Text>
                {collection.description && (
                  <Text className="text-muted-foreground text-sm mb-2">
                    {collection.description}
                  </Text>
                )}
              </View>
            </View>

            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Text className="text-sm text-muted-foreground">
                  {collection.itemsCount || 0} words
                </Text>
              </View>
              <Text className="text-xs text-muted-foreground">
                {new Date(collection.updatedAt).toLocaleDateString()}
              </Text>
            </View>
          </Pressable>
        </Card>
      ))}
    </View>
  );
}
