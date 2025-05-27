import { ScrollView, ActivityIndicator, View, RefreshControl } from 'react-native';
import { Text } from '~/components/ui/text';
import { VocabularyCard } from './vocabulary-card';
import { useQuery } from '@tanstack/react-query';
import { getVocabularyCollections, type VocabularyCollection, type VocabularyType } from '~/lib/api/vocabulary';
import { useState } from 'react';
import { Button } from '~/components/ui/button';

interface VocabularyListProps {
  onVocabPress?: (collectionId: number) => void;
}

export function VocabularyList({ onVocabPress }: VocabularyListProps) {
  const [activeType, setActiveType] = useState<VocabularyType | undefined>();

  const { data: collections, isLoading, error, refetch, isRefetching } = useQuery<VocabularyCollection[]>({
    queryKey: ['vocabularyCollections', activeType],
    queryFn: () => getVocabularyCollections(activeType)
  });

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500 mb-2">Failed to load collections</Text>
        <Text className="text-sm text-foreground/70 text-center">
          {error instanceof Error ? error.message : 'Network error occurred'}
        </Text>
        <Text className="text-xs text-foreground/50 mt-4">
          Pull down to refresh and try again
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="flex-row justify-center gap-2 py-4 px-6 bg-background">
        <Button
          variant={activeType === undefined ? "default" : "outline"}
          onPress={() => setActiveType(undefined)}
        >
          <Text className={activeType === undefined ? "text-primary-foreground" : "text-foreground"}>
            All
          </Text>
        </Button>
        <Button
          variant={activeType === "WORD" ? "default" : "outline"}
          onPress={() => setActiveType("WORD")}
        >
          <Text className={activeType === "WORD" ? "text-primary-foreground" : "text-foreground"}>
            Words
          </Text>
        </Button>
        <Button
          variant={activeType === "SENTENCE" ? "default" : "outline"}
          onPress={() => setActiveType("SENTENCE")}
        >
          <Text className={activeType === "SENTENCE" ? "text-primary-foreground" : "text-foreground"}>
            Sentences
          </Text>
        </Button>
      </View>

      <ScrollView 
        className="flex-1 bg-secondary/50 p-6"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#007AFF"
          />
        }
      >
        {collections?.map((collection) => (
          <VocabularyCard
            key={collection.id}
            collection={collection}
            onPress={onVocabPress}
          />
        ))}

        {collections?.length === 0 && (
          <View className="flex-1 justify-center items-center py-12">
            <Text className="text-foreground/70">
              No {activeType?.toLowerCase() ?? 'vocabulary'} collections found
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
