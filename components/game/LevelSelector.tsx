import React, { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { View, TouchableOpacity, useColorScheme } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { GAME_SPEEDS } from '~/lib/game/word-constant';
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { NAV_THEME } from '~/lib/constants';

interface LevelSelectorProps {
  selectedLevel: number;
  onLevelChange: (level: number) => void;
}

export interface LevelSelectorRef {
  open: () => void;
  close: () => void;
}

const LevelSelector = forwardRef<LevelSelectorRef, LevelSelectorProps>(({ 
  selectedLevel, 
  onLevelChange 
}, ref) => {
  const [sheetIndex, setSheetIndex] = useState(-1);
  const [tempSelectedLevel, setTempSelectedLevel] = useState(selectedLevel);
  const bottomSheetRef = React.useRef<BottomSheet>(null);

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

  // Bottom sheet setup
  const snapPoints = ['25%', '70%'];

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    open: () => {
      setTempSelectedLevel(selectedLevel);
      bottomSheetRef.current?.expand();
    },
    close: () => {
      bottomSheetRef.current?.close();
    },
  }));

  const handleSheetChanges = useCallback((index: number) => {
    setSheetIndex(index);
    if (index === -1) {
      // Sheet is closed, reset temp selection
      setTempSelectedLevel(selectedLevel);
    }
  }, [selectedLevel]);

  const handleApply = () => {
    onLevelChange(tempSelectedLevel);
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
        <View className="flex-row justify-center items-center p-4 border-b border-border">
          <Text className="text-xl font-bold">Game Options</Text>
        </View>

        {/* Content */}
        <View className="h-[50vh]">
          <BottomSheetScrollView className="flex-1">
            <View className="p-4">
              <Text className="text-lg font-semibold mb-4 text-foreground">Difficulty Level</Text>
              
              {/* Level options with descriptions */}
              <View className="gap-3">
                {levels.map((level) => {
                  // Get word count for this level
                  const wordCount = defaultWordQuantities[level as keyof typeof defaultWordQuantities];
                  
                  return (
                    <TouchableOpacity
                      key={`level-${level}`}
                      className={`p-3 rounded-lg flex-row justify-between items-center border ${
                        tempSelectedLevel === level ? 'bg-primary/10 border-primary' : 'bg-secondary/30 border-transparent'
                      }`}
                      onPress={() => setTempSelectedLevel(level)}
                    >
                      <View className="flex-1">
                        <View className="flex-row items-center gap-2">
                          <View className={`w-6 h-6 rounded-full flex justify-center items-center ${
                            tempSelectedLevel === level ? 'bg-primary' : 'bg-secondary'
                          }`}>
                            <Text className={`font-bold text-sm ${
                              tempSelectedLevel === level ? 'text-primary-foreground' : 'text-secondary-foreground'
                            }`}>
                              {level}
                            </Text>
                          </View>
                          <Text className="font-bold text-foreground">
                            {level === 1 ? 'Easy' : level === 2 ? 'Medium' : level === 3 ? 'Hard' : level === 4 ? 'Expert' : 'Master'}
                          </Text>
                        </View>
                        
                        <Text className="text-xs text-muted-foreground mt-1 ml-8">
                          {level === 1 ? 'Slower words, good for beginners' : 
                           level === 2 ? 'Moderate speed, balanced difficulty' :
                           level === 3 ? 'Faster words, challenging pace' :
                           level === 4 ? 'High speed, for experienced players' :
                           'Maximum difficulty, for typing masters'}
                        </Text>
                      </View>
                      
                      <View className="flex-row items-center">
                        <Text className="text-xs mr-1 text-muted-foreground">Words:</Text>
                        <View className="bg-secondary/50 px-2 py-1 rounded">
                          <Text className="text-xs font-bold text-foreground">{wordCount}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </BottomSheetScrollView>
        </View>

        {/* Footer */}
        <View className="p-4 border-t border-border">
          <Button
            onPress={handleApply}
            className="w-full"
          >
            <Text className="text-primary-foreground font-medium">Apply & Close</Text>
          </Button>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

LevelSelector.displayName = 'LevelSelector';

export default LevelSelector;
