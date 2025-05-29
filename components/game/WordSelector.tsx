import React, { useState, useEffect, useMemo } from 'react';
import { View, TouchableOpacity, Modal, ScrollView, RefreshControl, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { getVocabularyCollections, getVocabularyCollection } from '~/lib/api/vocabulary';
import { VocabularyCollection, VocabularyCollectionWithItems } from '~/lib/api/types';
import { WordItem } from '~/lib/game/word-constant';
import { prepareWordsForGame } from '~/lib/game/vocabulary-transformer';
import * as LucideIcons from 'lucide-react-native';

interface WordSelectorProps {
  onWordsSelected: (words: WordItem[], source: 'api' | 'static', collectionTitle?: string) => void;
  selectedLevel: number;
  isVisible: boolean;
  onClose: () => void;
  onUseStaticWords: () => void;
}

interface LoadingState {
  collections: boolean;
  collection: boolean;
}

interface ErrorState {
  collections: string | null;
  collection: string | null;
}

export default function WordSelector({ 
  onWordsSelected, 
  selectedLevel, 
  isVisible, 
  onClose, 
  onUseStaticWords 
}: WordSelectorProps) {
  const [collections, setCollections] = useState<VocabularyCollection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<VocabularyCollection | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    collections: false,
    collection: false
  });
  const [error, setError] = useState<ErrorState>({
    collections: null,
    collection: null
  });
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPublicOnly, setShowPublicOnly] = useState(true);


  // Default word quantities based on level
  const defaultWordQuantities = {
    1: 6,
    2: 8,
    3: 10,
    4: 12,
    5: 15,
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isVisible) {
      setSelectedCollection(null);
      setSearchQuery('');
      setShowPublicOnly(true);
      setError({ collections: null, collection: null });
    }
  }, [isVisible]);

  // Fetch collections on mount and when visible
  useEffect(() => {
    if (isVisible) {
      fetchCollections();
    }
  }, [isVisible]);

  const fetchCollections = async () => {
    setLoading(prev => ({ ...prev, collections: true }));
    setError(prev => ({ ...prev, collections: null }));

    try {
      const fetchedCollections = await getVocabularyCollections();
      setCollections(fetchedCollections);
    } catch (err) {
      console.error('Failed to fetch vocabulary collections:', err);
      setError(prev => ({ 
        ...prev, 
        collections: 'Failed to load vocabulary collections. Please try again.' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, collections: false }));
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCollections();
    setRefreshing(false);
  };

  const handleCollectionSelect = async (collection: VocabularyCollection) => {
    setSelectedCollection(collection);
    setError(prev => ({ ...prev, collection: null }));
    
    // Automatically start the game with selected collection
    await handleUseCollection(collection);
  };

  const handleUseCollection = async (collection?: VocabularyCollection) => {
    const collectionToUse = collection || selectedCollection;
    if (!collectionToUse) return;

    setLoading(prev => ({ ...prev, collection: true }));
    setError(prev => ({ ...prev, collection: null }));

    try {
      // Fetch full collection with items
      const fullCollection: VocabularyCollectionWithItems = await getVocabularyCollection(collectionToUse.id);
      
      // Check if collection has enough items
      const requiredQuantity = defaultWordQuantities[selectedLevel as keyof typeof defaultWordQuantities];
      
      if (fullCollection.items.length === 0) {
        setError(prev => ({ 
          ...prev, 
          collection: 'This collection is empty. Please select another collection.' 
        }));
        return;
      }

      if (fullCollection.items.length < requiredQuantity) {
        console.warn(`Collection has only ${fullCollection.items.length} items, but ${requiredQuantity} required for level ${selectedLevel}`);
      }

      // Transform and prepare words for game
      const gameWords = prepareWordsForGame(fullCollection.items, requiredQuantity);

      if (gameWords.length === 0) {
        setError(prev => ({ 
          ...prev, 
          collection: 'No valid words found in this collection. Please select another collection.' 
        }));
        return;
      }

      // Return words to parent component and close modal
      onWordsSelected(gameWords, 'api', fullCollection.title);
      onClose();
      
    } catch (err) {
      console.error('Failed to fetch collection details:', err);
      setError(prev => ({ 
        ...prev, 
        collection: 'Failed to load collection details. Please try again.' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, collection: false }));
    }
  };

  // Filter and search collections
  const filteredCollections = useMemo(() => {
    let filtered = collections;
    
    // Apply public filter
    if (showPublicOnly) {
      filtered = filtered.filter(collection => collection.isPublic);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(collection => 
        collection.title.toLowerCase().includes(query) ||
        (collection.description && collection.description.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [collections, searchQuery, showPublicOnly]);

  const CloseIcon = LucideIcons.X;
  const BookIcon = LucideIcons.Book;
  const AlertCircleIcon = LucideIcons.AlertCircle;
  const RefreshCwIcon = LucideIcons.RefreshCw;
  const CheckIcon = LucideIcons.Check;
  const GlobeIcon = LucideIcons.Globe;
  const LockIcon = LucideIcons.Lock;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 justify-end bg-background/20">
        <View className="bg-accent rounded-t-3xl h-[90%] shadow-xl border-border">
          {/* Header */}
          <View className="flex-row justify-between items-center px-6 py-4 bg-card/50 backdrop-blur-sm">
            <View>
              <Text className="text-2xl font-bold text-card-foreground">Choose Vocabulary</Text>
              <Text className="text-sm text-card-foreground/60 mt-1">
                Level {selectedLevel} • {defaultWordQuantities[selectedLevel as keyof typeof defaultWordQuantities]} words needed
              </Text>
            </View>
            <TouchableOpacity 
              onPress={onClose}
              className="w-10 h-10 rounded-full bg-secondary/40 flex justify-center items-center active:bg-secondary/60"
            >
              <CloseIcon size={20} className="text-card-foreground" />
            </TouchableOpacity>
          </View>

          {/* Main Content */}
          <ScrollView 
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={handleRefresh}
                tintColor="#6366f1"
              />
            }
            showsVerticalScrollIndicator={false}
          >
            {/* Error Message for Collections */}
            {error.collections && (
              <View className="mx-6 mt-4 mb-2">
                <View className="flex-row items-center p-4 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-800">
                  <AlertCircleIcon size={20} className="text-red-600 dark:text-red-400 mr-3" />
                  <Text className="text-red-700 dark:text-red-300 flex-1 text-sm">{error.collections}</Text>
                  <TouchableOpacity 
                    onPress={fetchCollections}
                    className="ml-2 p-1"
                  >
                    <RefreshCwIcon size={18} className="text-red-600 dark:text-red-400" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Loading Collections */}
            {loading.collections && (
              <View className="flex-row justify-center items-center py-12">
                <ActivityIndicator size="large" color="#6366f1" />
                <Text className="ml-3 text-card-foreground/70">Loading collections...</Text>
              </View>
            )}

            {/* Search and Filter Controls */}
            {!loading.collections && !error.collections && collections.length > 0 && (
              <View className="px-6 py-4 gap-4">
                {/* Search Input */}
                <View className="relative">
                  <View className="flex-row items-center bg-background/20 rounded-xl px-4 py-3 border border-border/50">
                    
                    <TextInput
                      className="flex-1 text-card-foreground text-base"
                      placeholder="Search collections by name or description..."
                      placeholderTextColor="#9ca3af"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      returnKeyType="search"
                    />
                    {searchQuery.length > 0 && (
                      <TouchableOpacity 
                        onPress={() => setSearchQuery('')}
                        className="ml-2 p-1"
                      >
                        <CloseIcon size={16} className="text-card-foreground/50" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                
                {/* Filter Toggle */}
                <TouchableOpacity
                  className={`flex-row items-center p-4 rounded-xl border transition-colors ${
                    showPublicOnly 
                      ? 'bg-primary/10 border-primary/30' 
                      : 'bg-background/20 border-border/50'
                  }`}
                  onPress={() => setShowPublicOnly(!showPublicOnly)}
                  activeOpacity={0.7}
                >
                  
                  <View className="flex-1 ">
                    <Text className={`font-medium ${showPublicOnly ? 'text-primary' : 'text-card-foreground'}`}>
                      Public Collections Only
                    </Text>
                    <Text className="text-xs text-card-foreground/60 mt-1">
                      Filter to show only publicly available collections
                    </Text>
                  </View>
                  <View className={`w-8 h-8 rounded-full flex justify-center items-center ${
                    showPublicOnly ? 'bg-primary' : 'bg-border'
                  }`}>
                    {showPublicOnly && (
                      <CheckIcon size={16} className="text-primary-foreground" />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* Collections List */}
            {!loading.collections && !error.collections && (
              <View className="px-6">
                {/* Section Header */}
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-lg font-semibold text-card-foreground">
                    Available Collections
                  </Text>
                  {filteredCollections.length !== collections.length && (
                    <View className="bg-primary/10 px-3 py-1 rounded-full">
                      <Text className="text-primary text-xs font-medium">
                        {filteredCollections.length} of {collections.length}
                      </Text>
                    </View>
                  )}
                </View>
                
                {filteredCollections.length === 0 ? (
                  <View className="text-center py-12">
                    <BookIcon size={64} className="text-muted-foreground/40 mb-4 mx-auto" />
                    <Text className="text-card-foreground/70 text-lg font-medium mb-2">
                      {collections.length === 0 ? 'No Collections Available' : 'No Matches Found'}
                    </Text>
                    <Text className="text-muted-foreground text-center max-w-sm mx-auto">
                      {collections.length === 0 
                        ? 'Pull down to refresh and check for new vocabulary collections.'
                        : 'Try adjusting your search terms or removing filters to see more results.'
                      }
                    </Text>
                  </View>
                ) : (
                  <View className="gap-3">
                    {filteredCollections.map((collection) => (
                      <TouchableOpacity
                        key={collection.id}
                        className={`p-5 rounded-xl border-2 transition-all ${
                          loading.collection && selectedCollection?.id === collection.id
                            ? 'bg-primary/10 border-primary opacity-70' 
                            : 'bg-card border-border/50 active:bg-primary/10 active:border-primary/50'
                        }`}
                        onPress={() => handleCollectionSelect(collection)}
                        activeOpacity={0.8}
                        disabled={loading.collection}
                      >
                        <View className="flex-row justify-between items-start">
                          <View className="flex-1 mr-4">
                            <View className="flex-row items-center mb-2">
                              <Text className="font-bold text-card-foreground text-lg flex-1">
                                {collection.title}
                              </Text>
                              {loading.collection && selectedCollection?.id === collection.id && (
                                <View className="w-8 h-8 bg-primary/20 rounded-full flex justify-center items-center ml-2">
                                  <ActivityIndicator size={16} color="#6366f1" />
                                </View>
                              )}
                            </View>
                            
                            {collection.description && (
                              <Text 
                                className="text-card-foreground/70 text-sm mb-3 leading-relaxed"
                                numberOfLines={2}
                                ellipsizeMode="tail"
                              >
                                {collection.description}
                              </Text>
                            )}
                            
                            <View className="flex-row items-center justify-between">
                              <View className="flex-row items-center">
                                <BookIcon size={14} className="text-card-foreground/50 mr-1" />
                                <Text className="text-xs text-card-foreground/60 font-medium">
                                  {collection.itemsCount || 0} words
                                </Text>
                              </View>
                              
                              <View className="flex-row items-center">
                                {collection.isPublic ? (
                                  <GlobeIcon size={14} className="text-green-600 mr-1" />
                                ) : (
                                  <LockIcon size={14} className="text-amber-600 mr-1" />
                                )}
                                <Text className={`text-xs font-medium ${
                                  collection.isPublic ? 'text-green-600' : 'text-amber-600'
                                }`}>
                                  {collection.isPublic ? 'Public' : 'Private'}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Error Message for Collection */}
            {error.collection && (
              <View className="mx-6 mt-4">
                <View className="flex-row items-center p-4 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-800">
                  <AlertCircleIcon size={20} className="text-red-600 dark:text-red-400 mr-3" />
                  <Text className="text-red-700 dark:text-red-300 flex-1 text-sm">{error.collection}</Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Simple Footer - Play with Static Words */}
          {!loading.collections && !error.collections && (
            <View className="px-6 py-4 border-t border-border bg-card/50 backdrop-blur-sm">
              
              <Button
                variant="outline"
                className="py-4 rounded-xl border-2 border-primary/30 bg-transparent"
                onPress={() => {
                  onUseStaticWords();
                  onClose();
                }}
              >
                <Text className="text-primary font-semibold text-base">Play</Text>
              </Button>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}
