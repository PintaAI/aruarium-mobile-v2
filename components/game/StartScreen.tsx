import React, { useState, useRef } from 'react';
import { View, } from 'react-native';

import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { useGameStore } from '~/lib/game/z-type/store/gameStore';
import { GAME_SPEEDS, getRandomWords, WordItem } from '~/lib/game/word-constant';
import WordSelector, { WordSelectorRef } from './WordSelector';
import LevelSelector, { LevelSelectorRef } from './LevelSelector';
import * as LucideIcons from 'lucide-react-native';
import { iconWithClassName } from '~/lib/icons/iconWithClassName';

interface StartScreenProps {
  iconName?: string;
  title: string;
  onPlay: (words: WordItem[], wordQuantity: number, source?: 'api' | 'static', collectionTitle?: string) => void;
  onExit: () => void;
}

export default function StartScreen({ iconName, title, onPlay, onExit }: StartScreenProps) {
  const { setLevel } = useGameStore();
  const [selectedLevel, setSelectedLevel] = useState(1);
  const wordSelectorRef = useRef<WordSelectorRef>(null);
  const levelSelectorRef = useRef<LevelSelectorRef>(null);

  // Default word quantities based on level
  const defaultWordQuantities = {
    1: 6,
    2: 8,
    3: 10,
    4: 12,
    5: 15,
  };

  const handlePlay = () => {
    setLevel(selectedLevel);
    wordSelectorRef.current?.open();
  };

  const handleUseStaticWords = () => {
    // Get the default word quantity for selected level
    const quantity = defaultWordQuantities[selectedLevel as keyof typeof defaultWordQuantities];
    // Get random words based on quantity
    const randomWords = getRandomWords(quantity);
    onPlay(randomWords, quantity, 'static');
  };

  const handleWordsSelected = (words: WordItem[], source: 'api' | 'static', collectionTitle?: string) => {
    onPlay(words, words.length, source, collectionTitle);
  };

  const handleOpenOptions = () => {
    levelSelectorRef.current?.open();
  };

  const handleLevelChange = (level: number) => {
    setSelectedLevel(level);
  };

  return (
   
      <View className="flex-1 justify-center items-center bg-background p-6">
        {/* Game Logo/Icon */}
        {iconName && (
          <View className="mb-8 items-center justify-center">
            {(() => {
              // Dynamically get the icon from Lucide icons
              const IconComponent = (LucideIcons as any)[iconName];
              
              if (IconComponent) {
                // Apply iconWithClassName to the icon
                iconWithClassName(IconComponent);
                
                // Render the icon with styling
                return <IconComponent size={64} className="text-primary" />;
              }
              return null;
            })()}
          </View>
        )}
        
        {/* Game Title */}
        <Text className="text-4xl font-bold mb-12 text-primary">{title}</Text>
        
        {/* Main Menu Buttons */}
        <View className="w-64 flex flex-col gap-4">
          <Button 
            className="bg-primary py-4"
            onPress={handlePlay}
          >
            <Text className="text-primary-foreground text-lg font-bold">Play</Text>
          </Button>
          
          <Button 
            variant="default" 
            className="py-4 border-2 border-primary"
            onPress={handleOpenOptions}
          >
            <Text className="text-primary-foreground text-lg font-bold">Options</Text>
          </Button>
          
          <Button 
            variant="destructive" 
            className="py-4"
            onPress={onExit}
          >
            <Text className="text-destructive-foreground text-lg font-bold">Exit</Text>
          </Button>
        </View>

        {/* Word Selector Bottom Sheet */}
        <WordSelector
          ref={wordSelectorRef}
          selectedLevel={selectedLevel}
          onWordsSelected={handleWordsSelected}
          onUseStaticWords={handleUseStaticWords}
        />

        {/* Level Selector Bottom Sheet */}
        <LevelSelector
          ref={levelSelectorRef}
          selectedLevel={selectedLevel}
          onLevelChange={handleLevelChange}
        />
      </View>
    
  );
}
