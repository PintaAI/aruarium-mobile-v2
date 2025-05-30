import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { View, TouchableOpacity, ScrollView, ActivityIndicator, useColorScheme } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { getVocabularyCollections, getVocabularyCollection } from '~/lib/api/vocabulary';
import { VocabularyCollection, VocabularyCollectionWithItems } from '~/lib/api/types';
import { WordItem } from '~/lib/game/word-constant';
import { prepareWordsForGame } from '~/lib/game/vocabulary-transformer';
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { NAV_THEME } from '~/lib/constants';
import { RefreshCw } from 'lucide-react-native';
import { iconWithClassName } from '~/lib/icons/iconWithClassName';

interface WordSelectorProps {
  onWordsSelected: (words: WordItem[], source: 'api' | 'static', collectionTitle?: string) => void;
  selectedLevel: number;
  onUseStaticWords: () => void;
}

export interface WordSelectorRef {
  open: () => void;
  close: () => void;
  refresh: () => void;
}

const WordSelector = forwardRef<WordSelectorRef, WordSelectorProps>(({ 
  onWordsSelected, 
  selectedLevel, 
  onUseStaticWords 
}, ref) => {
  const [collections, setCollections] = useState<VocabularyCollection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const defaultWordQuantities = {
    1: 6,
    2: 8,
    3: 10,
    4: 12,
    5: 15,
  };

  // Bottom sheet setup
  const snapPoints = ['25%', '70%'];
  const [sheetIndex, setSheetIndex] = useState(-1);
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    open: () => {
      bottomSheetRef.current?.expand();
      // Only fetch if we haven't loaded collections yet
      if (!hasLoaded) {
        fetchCollections();
      }
    },
    close: () => {
      bottomSheetRef.current?.close();
    },
    refresh: () => {
      setHasLoaded(false);
      fetchCollections();
    },
  }));

  const handleSheetChanges = useCallback((index: number) => {
    setSheetIndex(index);
    if (index === -1) {
      // Sheet is closed, reset state
      setError(null);
    }
  }, []);

  const fetchCollections = async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedCollections = await getVocabularyCollections();
      setCollections(fetchedCollections);
      setHasLoaded(true);
    } catch (err) {
      setError('Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  const handleCollectionSelect = async (collection: VocabularyCollection) => {
    try {
      const fullCollection: VocabularyCollectionWithItems = await getVocabularyCollection(collection.id);
      const requiredQuantity = defaultWordQuantities[selectedLevel as keyof typeof defaultWordQuantities];
      const gameWords = prepareWordsForGame(fullCollection.items, requiredQuantity);

      if (gameWords.length === 0) {
        setError('No valid words found in this collection');
        return;
      }

      onWordsSelected(gameWords, 'api', fullCollection.title);
      bottomSheetRef.current?.close();
    } catch (err) {
      setError('Failed to load collection');
    }
  };

  const handleUseStaticWords = () => {
    onUseStaticWords();
    bottomSheetRef.current?.close();
  };

  const colorScheme = useColorScheme();
  const theme = NAV_THEME[colorScheme ?? 'light'];

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      enableContentPanningGesture={sheetIndex === snapPoints.length - 1}
      enableHandlePanningGesture={true}
      enableOverDrag={false}
      enableDynamicSizing={false}
      backgroundStyle={{ backgroundColor: theme.card }}
      handleIndicatorStyle={{ backgroundColor: theme.border }}
    >
      <BottomSheetView className="flex-1 rounded rounded-3xl overflow-hidden border border-border">
        {/* Header */}
        <View className="flex-row justify-between items-center p-4 border-b border-border">
          <Text className="text-xl font-bold">Choose Vocabulary</Text>
          <TouchableOpacity 
            onPress={() => {
              setHasLoaded(false);
              fetchCollections();
            }}
            className="p-2 rounded-full bg-secondary/30"
            disabled={loading}
          >
            {(() => {
              const RefreshIcon = iconWithClassName(RefreshCw);
              return <RefreshIcon size={16} className={`${loading ? 'text-muted-foreground' : 'text-foreground'}`} />;
            })()}
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="h-[50vh]">
          {loading && (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" />
              <Text className="mt-2 text-muted-foreground">Loading...</Text>
            </View>
          )}

          {error && (
            <View className="p-4">
              <Text className="text-destructive text-center">{error}</Text>
            </View>
          )}

          {!loading && !error && (
            <BottomSheetScrollView className="flex-1">
              <View className="p-4">
                {collections.length === 0 ? (
                  <Text className="text-center text-muted-foreground py-8">
                    No collections available
                  </Text>
                ) : (
                  collections.map((collection) => (
                    <TouchableOpacity
                      key={collection.id}
                      onPress={() => handleCollectionSelect(collection)}
                      className="p-3 rounded-lg flex-row justify-between items-center border mb-3 bg-secondary/30 border-transparent"
                    >
                      <View className="flex-1">
                        <View className="flex-row items-center gap-2">
                          <View className="w-6 h-6 rounded-full flex justify-center items-center bg-primary">
                            <Text className="font-bold text-xs text-primary-foreground">
                              📚
                            </Text>
                          </View>
                          <Text className="font-bold text-foreground text-lg">
                            {collection.title}
                          </Text>
                        </View>
                        
                        <Text className="text-xs text-muted-foreground mt-1 ml-8">
                          Vocabulary collection for game practice
                        </Text>
                      </View>
                      
                      <View className="flex-row items-center">
                        <Text className="text-xs mr-1 text-muted-foreground">Words:</Text>
                        <View className="bg-secondary/50 px-2 py-1 rounded mr-2">
                          <Text className="text-xs font-bold text-foreground">{collection.itemsCount || 0}</Text>
                        </View>
                        {collection.isPublic && (
                          <View className="bg-green-500/20 px-2 py-1 rounded">
                            <Text className="text-xs font-bold text-green-600">✓</Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </BottomSheetScrollView>
          )}
        </View>

        {/* Footer */}
        <View className="p-4 border-t border-border">
          <Button
            onPress={handleUseStaticWords}
            className="w-full"
          >
            <Text className="text-primary-foreground font-medium">Use Default Words</Text>
          </Button>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

WordSelector.displayName = 'WordSelector';

export default WordSelector;
