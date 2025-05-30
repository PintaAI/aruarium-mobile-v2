import React, { useState, useEffect, useRef } from 'react';
import { View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useMatchkorStore } from '~/lib/game/matchkor/store/gameStore';
import { getMatchkorWords, getWordPairsFromSelection } from '~/lib/game/matchkor/utils/wordHelpers';
import { WordItem } from '~/lib/game/word-constant';

// Reused components from game components
import StartScreen from '~/components/game/StartScreen';
import FlipCardBoard from '~/lib/game/matchkor/components/FlipCardBoard';
import MatchkorHUD from '~/lib/game/matchkor/components/MatchkorHUD';
import MatchkorGameOver from '~/lib/game/matchkor/components/MatchkorGameOver';

type GameScreen = 'start' | 'playing' | 'gameOver';

export default function MatchkorScreen() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('start');
  const [selectedWords, setSelectedWords] = useState<WordItem[]>([]);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [wordSource, setWordSource] = useState<'api' | 'static'>('static');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { 
    gameStatus, 
    initializeGame, 
    incrementTimer, 
    resetGame,
    setLevel
  } = useMatchkorStore();

  // Timer effect
  useEffect(() => {
    if (gameStatus === 'playing') {
      timerRef.current = setInterval(() => {
        incrementTimer();
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameStatus, incrementTimer]);

  // Handle game status changes
  useEffect(() => {
    if (gameStatus === 'completed') {
      setCurrentScreen('gameOver');
    }
  }, [gameStatus]);

  const handlePlay = (words: WordItem[], wordQuantity: number, source?: 'api' | 'static', collectionTitle?: string) => {
    setSelectedWords(words);
    setWordSource(source || 'static');
    
    // Convert words to pairs for the matching game
    const wordPairs = getWordPairsFromSelection(words);
    
    // Initialize the game
    initializeGame(wordPairs, selectedLevel);
    setCurrentScreen('playing');
  };

  const handleUseStaticWords = () => {
    // Get words based on selected level
    const wordPairs = getMatchkorWords(selectedLevel);
    
    // Convert back to WordItem format for compatibility
    const words: WordItem[] = wordPairs.map((pair, index) => ({
      id: `w${index}`,
      name: pair.korean,
      meaning: pair.english,
    }));
    
    handlePlay(words, words.length, 'static');
  };

  const handleRestart = () => {
    resetGame();
    setCurrentScreen('start');
  };

  const handleTryAgain = () => {
    if (selectedWords.length > 0) {
      handlePlay(selectedWords, selectedWords.length, wordSource);
    } else {
      handleUseStaticWords();
    }
  };

  const handleExit = () => {
    resetGame();
    router.back();
  };

  const handleLevelChange = (level: number) => {
    setSelectedLevel(level);
    setLevel(level);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {currentScreen === 'start' && (
        <StartScreen
          iconName="Layers"
          title="Matchkor"
          onPlay={handlePlay}
          onExit={handleExit}
        />
      )}

      {currentScreen === 'playing' && (
        <View className="flex-1">
          <MatchkorHUD />
          <FlipCardBoard />
        </View>
      )}

      {currentScreen === 'gameOver' && (
        <MatchkorGameOver
          onRestart={handleRestart}
          onTryAgain={handleTryAgain}
          onExit={handleExit}
        />
      )}
    </SafeAreaView>
  );
}
