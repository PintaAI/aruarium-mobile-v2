import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import { getVocabularyCollections } from '~/lib/api/vocabulary';
import { VocabularyCollection } from '~/lib/api/types';
import { Pressable } from 'react-native';
import { Book, Users, Globe } from 'lucide-react-native';
import { cssInterop } from 'nativewind';

// Apply cssInterop to icons
[Book, Users, Globe].forEach((icon) => {
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
}

export function VocabularyList({ onVocabPress }: VocabularyListProps) {
  const [collections, setCollections] = useState<VocabularyCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Stable params object to prevent infinite re-renders
  const params = useMemo(() => ({ publicOnly: true }), []);

  const fetchCollections = async (isRefresh = false) => {
    console.log('🔄 Fetching public vocabulary collections...');
    
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await getVocabularyCollections(params);
      setCollections(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch collections';
      console.error('❌ Error fetching collections:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleRefresh = () => {
    fetchCollections(true);
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-muted-foreground">Loading vocabulary collections...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-destructive mb-4">Error: {error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="p-4 border-b border-border">
        <Text className="text-2xl font-bold">Public Vocabulary Collections</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {collections.length === 0 ? (
          <View className="flex-1 justify-center items-center py-12">
            <Book className="w-16 h-16 text-muted-foreground mb-4" />
            <Text className="text-xl font-semibold mb-2">No Public Collections</Text>
            <Text className="text-muted-foreground text-center">
              There are no public vocabulary collections available yet
            </Text>
          </View>
        ) : (
          <View className="gap-4">
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
                    <Globe className="w-4 h-4 text-green-500" />
                  </View>

                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                      <Users className="w-4 h-4 text-muted-foreground mr-1" />
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
        )}
      </ScrollView>
    </View>
  );
}
