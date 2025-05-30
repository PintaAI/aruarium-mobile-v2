import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { Text } from '~/components/ui/text';
import { VocabularyList } from '~/components/vocabulary/vocabulary-list';
import { getVocabularyCollections } from '~/lib/api/vocabulary';
import { VocabularyCollection } from '~/lib/api/types';
import { Book } from 'lucide-react-native'; // Import Book icon if needed for empty state in ScrollView
import { cssInterop } from 'nativewind';

// Apply cssInterop to Book icon if it's used and not already configured
cssInterop(Book, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      color: true,
      opacity: true,
    },
  },
});


export default function Vocab() {
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
  }, []); // Removed params from dependency array as it's stable due to useMemo

  const handleRefresh = () => {
    fetchCollections(true);
  };

  const handleCollectionPress = (collectionId: number) => {
    // Simple logging for now - can be extended later for navigation
    console.log('Collection pressed:', collectionId);
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

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <VocabularyList
          onVocabPress={handleCollectionPress}
          collections={collections}
          loading={loading}
          error={error}
          refreshing={refreshing}
        />
      </ScrollView>
    </View>
  );
}
