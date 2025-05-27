import React from 'react';
import { TextInput, View } from 'react-native';
import { useGameStore } from '~/lib/game/z-type/store/gameStore';

interface GameInputProps {
  placeholder?: string;
}

/**
 * GameInput component that captures user typing input 
 * and stores it in the Zustand game store
 */
export const GameInput = ({ placeholder = "Type here..." }: GameInputProps) => {
  const { inputText, setInputText } = useGameStore();

  const handleChangeText = (text: string) => {
    setInputText(text);
  };

  return (
    <View className="w-full">
      <TextInput
        className="h-10 border text-center border-primary/10 rounded-md px-2 mt-0 bg-card text-foreground"
        placeholder={placeholder}
        placeholderTextColor="#888888"
        value={inputText}
        onChangeText={handleChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        
      />
    </View>
  );
};

export default GameInput;
