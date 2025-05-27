import React, { useState, useRef, useEffect } from 'react';
import { Dimensions, KeyboardAvoidingView, Platform, View } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Word } from '~/lib/game/z-type/entities/Word';
import { Player } from '~/lib/game/z-type/entities/Player';
import { MovementSystem } from '~/lib/game/z-type/systems/MovementSystem';
import { getRandomSpeed, WordItem } from '~/lib/game/word-constant';
import { useGameStore } from '~/lib/game/z-type/store/gameStore';
import GameInput from '~/components/game/GameInput';
import GameHUD from '~/components/game/GameHUD';
import StartScreen from '~/components/game/StartScreen';
import GameOverScreen from '~/components/game/GameOverScreen';
import Laser from '~/components/game/Laser';

/**
 * Z-Type Game - Type words as they fall from the top of the screen
 */

// Entity type for game objects
interface Entities {
  [key: string]: any;
}

// Player entity position constants
const PLAYER_HORIZONTAL_OFFSET = 12;
const PLAYER_VERTICAL_OFFSET_ANDROID = 32;
const PLAYER_VERTICAL_OFFSET_IOS = 20;
const { width, height } = Dimensions.get('window');


export default function ZTypeGame() {
  // Game state
  const [showStartScreen, setShowStartScreen] = useState<boolean>(true);
  const [running, setRunning] = useState<boolean>(false);
  const [dimensions, setDimensions] = useState({ width, height });
  const [engineKey, setEngineKey] = useState<number>(0); // Add key for engine remounting
  // Game engine reference
  const gameEngineRef = useRef<GameEngine>(null);
  // Game store
  const { level, reset, setIsRunning, isGameOver } = useGameStore();
  // Reset game state when component mounts
  useEffect(() => {
    reset();
  }, [reset]);

  /**
   * Create player entity positioned at the bottom center of the screen
   */
  const createPlayerEntity = () => ({
    position: [
      dimensions.width / 2 - PLAYER_HORIZONTAL_OFFSET,
      dimensions.height - (Platform.OS === 'android' ? PLAYER_VERTICAL_OFFSET_ANDROID : PLAYER_VERTICAL_OFFSET_IOS)
    ],
    rotation: 0,
    velocity: [0, 0],
    color: '#10b981',
    gamearea: dimensions,
    renderer: Player
  });
  
  // Initialize entities with empty state initially
  const [entities, setEntities] = useState<Entities>(() => ({
    player: createPlayerEntity()
  }));
  
  /**
   * Initialize game entities with words
   */
  const initializeEntities = (words: WordItem[]) => {
    const allEntities: Entities = {};
    
    // Create word entities
    words.forEach((word) => {
      // Random positioning within top third of screen
      const randomX = Math.random() * (dimensions.width - 100);
      const randomY = Math.random() * (dimensions.height / 3);
      const randomSpeed = getRandomSpeed(level as 1|2|3|4|5);
      
      allEntities[`word-${word.id}`] = {
        name: word.name,
        meaning: word.meaning,
        position: [randomX, randomY],
        velocity: [0, randomSpeed],
        gamearea: dimensions,
        renderer: Word,
        isFocused: false,
        isMatching: false
      };
    });
    
    // Add player entity
    allEntities.player = createPlayerEntity();
    
    return allEntities;
  };
  
  /**
   * Update layout dimensions when game area size changes
   */
  const onLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions({ width, height });
  };

  /**
   * Update all entities when dimensions change
   */
  useEffect(() => {
    Object.keys(entities).forEach(key => {
      if (entities[key] && entities[key].position) {
        // Update gamearea for all entities
        entities[key].gamearea = dimensions;
        
        // Update player position
        if (key === 'player') {
          entities[key].position[0] = dimensions.width / 2 - PLAYER_HORIZONTAL_OFFSET;
          entities[key].position[1] = dimensions.height - (Platform.OS === 'android' ? 
            PLAYER_VERTICAL_OFFSET_ANDROID : PLAYER_VERTICAL_OFFSET_IOS);
        }
      }
    });
  }, [dimensions, entities]);

  /**
   * Update word speeds when level changes
   */
  useEffect(() => {
    if (!running || !gameEngineRef.current || !entities) return;
    
    // When level changes, update all word entities with new speeds based on level
    Object.keys(entities).forEach(key => {
      if (key !== 'player' && entities[key] && entities[key].velocity) {
        // Apply new speed based on current level
        const randomSpeed = getRandomSpeed(level as 1|2|3|4|5);
        entities[key].velocity[1] = randomSpeed;
      }
    });
  }, [level, running, entities]);

  /**
   * Start game with words selected from StartScreen
   */
  const startGame = (words: WordItem[], qty: number) => {
    const newEntities = initializeEntities(words);
    setEntities(newEntities);
    setShowStartScreen(false);
    setRunning(true);
    setIsRunning(true);
  };

  /**
   * Exit game directly
   */
  const exitGame = () => {
    router.back();
  };
  
  // Game engine style
  const gameEngineStyle = {
    position: 'absolute' as 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 10,
    overflow: 'hidden' as 'hidden'
  };

  // Handle game restart - go back to start screen
  const handleRestart = () => {
    // Reset the game state
    reset();
    // Initialize with new entities
    setEntities({ player: createPlayerEntity() });
    // Show the start screen
    setShowStartScreen(true);
  };

  // Handle try again - reset all stats including level and remount game engine
  const handleTryAgain = () => {
    reset();
    
    // Reset Y positions for all word entities
    const updatedEntities = { ...entities };
    Object.keys(updatedEntities).forEach(key => {
      if (key !== 'player' && updatedEntities[key] && updatedEntities[key].position) {
        // Reset position - keep X but randomize Y within top third of screen
        const randomY = Math.random() * (dimensions.height / 3);
        updatedEntities[key].position[1] = randomY;
        
        // Reset any game state flags on the entity
        updatedEntities[key].isFocused = false;
        updatedEntities[key].isMatching = false;
        updatedEntities[key].isSuperword = false;
        
        // Update velocity based on level 1 (reset)
        const randomSpeed = getRandomSpeed(1);
        updatedEntities[key].velocity[1] = randomSpeed;
      }
    });
    
    // Update entities with repositioned words
    setEntities(updatedEntities);
    
    // Remount game engine and reset game state
    setEngineKey(prev => prev + 1);
    setIsRunning(true);
    setRunning(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {showStartScreen ? (
        // Start screen with game options
        <StartScreen 
          title="Z-Type Game"
          iconName="Keyboard"
          onPlay={startGame}
          onExit={exitGame}
        />
      ) : isGameOver ? (
        // Game over screen
        <GameOverScreen
          onRestart={handleRestart}
          onTryAgain={handleTryAgain}
          onExit={exitGame}
        />
      ) : (
        // Active gameplay screen
        <KeyboardAvoidingView 
          className="flex-1"
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 5}
        >
          <View className="flex-1 rounded-lg p-2">
            {/* Game engine container */}
            <View 
              className="flex-1"
              onLayout={onLayout}
            >
              <GameEngine
                key={`engine-${engineKey}`} // Add key to force remount
                ref={gameEngineRef}
                style={gameEngineStyle}
                systems={[MovementSystem]}
                entities={entities}
                running={running}
              />
              
              {/* Game HUD for score and stats */}
              {running && <GameHUD />}
              
              {/* Laser effect connecting player to focused word */}
              {running && (
                <Laser 
                  gameEngineRef={gameEngineRef} 
                  entities={entities}
                  startOffset={-5}
                  endOffset={30}
                  startXOffset={6}
                  endXOffset={50}
                  laserDuration={150}
                  animationDuration={50}
                />
              )}
            </View>
            
            {/* Game input for typing words */}
            <GameInput placeholder="ketik di sini" />
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}
