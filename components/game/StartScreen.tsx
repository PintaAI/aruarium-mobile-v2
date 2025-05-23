import React, { useState } from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { useGameStore } from '~/lib/game/z-type/store/gameStore';
import { GAME_SPEEDS, getRandomWords, WordItem } from '~/lib/game/word-constant';
import * as LucideIcons from 'lucide-react-native';
import { iconWithClassName } from '~/lib/icons/iconWithClassName';

interface StartScreenProps {
  iconName?: string;
  title: string;
  onPlay: (words: WordItem[], wordQuantity: number) => void;
  onExit: () => void;
}

export default function StartScreen({ iconName, title, onPlay, onExit }: StartScreenProps) {
  const { setLevel } = useGameStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(1);

  // Level options from GAME_SPEEDS constant
  const levels = Object.keys(GAME_SPEEDS.LEVELS).map(Number);
  
  // Default word quantities based on level
  const defaultWordQuantities = {
    1: 6,
    2: 8,
    3: 10,
    4: 12,
    5: 15,
  };

  const handlePlay = () => {
    // Get the default word quantity for selected level
    const quantity = defaultWordQuantities[selectedLevel as keyof typeof defaultWordQuantities];
    // Get random words based on quantity
    const randomWords = getRandomWords(quantity);
    setLevel(selectedLevel);
    onPlay(randomWords, quantity);
  };

  const handleOpenOptions = () => {
    setModalVisible(true);
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

      {/* Options Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-card p-6 rounded-xl w-4/5 max-w-md shadow-lg border border-border">
            {/* Modal Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-card-foreground">Game Options</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                className="w-8 h-8 rounded-full bg-secondary/30 flex justify-center items-center"
              >
                <Text className="text-card-foreground text-base font-bold">✕</Text>
              </TouchableOpacity>
            </View>
            
            {/* Level Selection */}
            <View className="mb-8">
              <Text className="text-lg font-semibold mb-4 text-card-foreground">Difficulty Level</Text>
              
              {/* Level options with descriptions */}
              <View className="gap-3">
                {levels.map((level) => {
                  // Get word count for this level
                  const wordCount = defaultWordQuantities[level as keyof typeof defaultWordQuantities];
                  
                  return (
                    <TouchableOpacity
                      key={`level-${level}`}
                      className={`p-3 rounded-lg flex-row justify-between items-center border ${
                        selectedLevel === level ? 'bg-primary/10 border-primary' : 'bg-secondary/30 border-transparent'
                      }`}
                      onPress={() => setSelectedLevel(level)}
                    >
                      <View className="flex-1">
                        <View className="flex-row items-center gap-2">
                          <View className={`w-6 h-6 rounded-full flex justify-center items-center bg-${selectedLevel === level ? 'primary' : 'secondary'}`}>
                            <Text className={`font-bold text-sm ${selectedLevel === level ? 'text-primary-foreground' : 'text-secondary-foreground'}`}>
                              {level}
                            </Text>
                          </View>
                          <Text className="font-bold text-card-foreground">
                            {level === 1 ? 'Easy' : level === 2 ? 'Medium' : level === 3 ? 'Hard' : level === 4 ? 'Expert' : 'Master'}
                          </Text>
                        </View>
                        
                        <Text className="text-xs text-card-foreground/70 mt-1 ml-8">
                          {level === 1 ? 'Slower words, good for beginners' : 
                           level === 2 ? 'Moderate speed, balanced difficulty' :
                           level === 3 ? 'Faster words, challenging pace' :
                           level === 4 ? 'High speed, for experienced players' :
                           'Maximum difficulty, for typing masters'}
                        </Text>
                      </View>
                      
                      <View className="flex-row items-center">
                        <Text className="text-xs mr-1 text-card-foreground/70">Words:</Text>
                        <View className="bg-secondary/50 px-2 py-1 rounded">
                          <Text className="text-xs font-bold text-card-foreground">{wordCount}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            
            {/* Action Button */}
            <Button
              className="bg-primary py-3 w-full"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-primary-foreground text-base font-bold">Apply & Close</Text>
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}
