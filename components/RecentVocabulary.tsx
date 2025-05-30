import { View, ActivityIndicator, ScrollView } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import { useEffect, useState } from 'react';
import { vocabularyApi } from '~/lib/api/vocabulary';
import { VocabularyCollection } from '~/lib/api/types';

// Helper function to format relative time
function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}

export function RecentVocabulary() {
  const [collections, setCollections] = useState<VocabularyCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVocabularyCollections() {
      try {
        setLoading(true);
        setError(null);

        // Fetch public vocabulary collections
        const userCollections = await vocabularyApi.getPublicCollections();
        
        // Sort by creation date (most recent first) and limit to 10 for horizontal scroll
        const sortedCollections = userCollections
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10);
        
        setCollections(sortedCollections);
      } catch (err) {
        console.error('Failed to fetch vocabulary collections:', err);
        setError('Failed to load vocabulary collections');
      } finally {
        setLoading(false);
      }
    }

    fetchVocabularyCollections();
  }, []);

  if (loading) {
    return (
      <View className="w-full">
        <Text className="text-xl font-bold mb-4">Vocabulary Collections</Text>
        <View className="flex items-center justify-center py-8">
          <ActivityIndicator size="large" className="text-primary" />
          <Text className="text-foreground/60 mt-2">Loading collections...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="w-full">
        <Text className="text-xl font-bold mb-4">Vocabulary Collections</Text>
        <Card className="p-4">
          <Text className="text-destructive text-center">{error}</Text>
          <Text className="text-foreground/60 text-center text-sm mt-1">
            Pull to refresh to try again
          </Text>
        </Card>
      </View>
    );
  }

  if (collections.length === 0) {
    return (
      <View className="w-full">
        <Text className="text-xl font-bold mb-4">Vocabulary Collections</Text>
        <Card className="p-4">
          <Text className="text-foreground/60 text-center">
            No vocabulary collections yet
          </Text>
          <Text className="text-foreground/40 text-center text-sm mt-1">
            Create your first vocabulary collection to get started
          </Text>
        </Card>
      </View>
    );
  }

  return (
    <View className="w-full">
      <Text className="text-xl font-bold mb-4">Vocabulary Collections</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={true}
        className="-mx-4"
        contentContainerStyle={{ gap: 12, paddingHorizontal: 16 , paddingBottom: 14 }}
        snapToInterval={352}
        decelerationRate="fast"
        snapToAlignment="start"
      >
        {collections.map((collection) => (
          <Card key={collection.id} className="w-[340px] p-3">
            <View className="flex gap-1">
              <Text className="text-lg font-bold">{collection.title}</Text>
              {collection.description && (
                <Text className="text-foreground/80 text-sm" numberOfLines={2}>
                  {collection.description}
                </Text>
              )}
              <View className="flex-row gap-2 items-center mt-2">
                <Text className="text-xs bg-primary/10 px-2 py-1 rounded-full">
                  {collection.itemsCount || 0} words
                </Text>
                <Text className="text-xs text-foreground/50">
                  {formatRelativeTime(collection.createdAt)}
                </Text>
              </View>
              {collection.isPublic && (
                <View className="mt-1">
                  <Text className="text-xs bg-secondary/10 px-2 py-1 rounded-full self-start">
                    Public
                  </Text>
                </View>
              )}
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}
