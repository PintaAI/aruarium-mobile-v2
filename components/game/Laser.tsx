import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet,} from 'react-native';
import { useGameStore } from '~/lib/game/z-type/store/gameStore';

// Types
interface LaserProps {
  gameEngineRef: React.RefObject<any>;
  entities: Record<string, any>;
  startOffset?: number; // Offset from player position along direction vector
  endOffset?: number; // Offset from word position along direction vector
  startXOffset?: number; // Horizontal offset from player position
  endXOffset?: number; // Horizontal offset from word position
  laserDuration?: number; // Duration of laser display in ms
  animationDuration?: number; // Duration of animation in ms
}

// Constants
const LASER_COLOR = '#00FF00'; // Green laser
const LASER_THICKNESS = 2;
const DEFAULT_LASER_DURATION = 150; // Default display time in ms (increased)
const DEFAULT_ANIMATION_DURATION = 50; // Default animation duration in ms (decreased)
const DEFAULT_START_OFFSET = 15; // Default offset from player position
const DEFAULT_END_OFFSET = 10; // Default offset from word position
const DEFAULT_START_X_OFFSET = 0; // Default horizontal offset from player
const DEFAULT_END_X_OFFSET = 0; // Default horizontal offset from word

/**
 * Laser component that renders a line from player to the focused word
 * when the user inputs correct letters
 */
const Laser: React.FC<LaserProps> = ({ 
  gameEngineRef, 
  entities,
  startOffset = DEFAULT_START_OFFSET,
  endOffset = DEFAULT_END_OFFSET,
  startXOffset = DEFAULT_START_X_OFFSET,
  endXOffset = DEFAULT_END_X_OFFSET, 
  laserDuration = DEFAULT_LASER_DURATION,
  animationDuration = DEFAULT_ANIMATION_DURATION
}) => {
  const { inputText, focusedWordId } = useGameStore();
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [showLaser, setShowLaser] = useState(false);
  const lastInputLengthRef = useRef(0);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const timeoutRef = useRef<number | null>(null);
  
  // Detect when a new letter is typed and show laser briefly
  useEffect(() => {
    if (focusedWordId && inputText.length > 0 && inputText.length > lastInputLengthRef.current) {
      // Clear any existing animations and timeouts
      if (animationRef.current) {
        animationRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // New letter detected, show laser
      setShowLaser(true);
      
      // Animate laser appearance
      animationRef.current = Animated.timing(opacityAnim, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      });
      
      animationRef.current.start();
      
      // Set timeout to hide laser after a short time
      timeoutRef.current = setTimeout(() => {
        // Hide laser after timeout
        animationRef.current = Animated.timing(opacityAnim, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        });
        
        animationRef.current.start(() => {
          setShowLaser(false);
        });
      }, laserDuration);
      
      // Update last input length
      lastInputLengthRef.current = inputText.length;
      
      // Cleanup function
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        if (animationRef.current) {
          animationRef.current.stop();
        }
      };
    } else if (inputText.length < lastInputLengthRef.current) {
      // Input text was cleared or reduced
      lastInputLengthRef.current = inputText.length;
    }
  }, [focusedWordId, inputText, laserDuration, animationDuration]);
  
  // Only render when there's a focused word and showLaser is true
  if (!focusedWordId || !showLaser) {
    return null;
  }
  
  if (!entities) {
    return null;
  }
  
  // Get player entity
  const player = entities.player;
  if (!player || !player.position) {
    return null;
  }
  
  // Get focused word entity
  const focusedWord = entities[`word-${focusedWordId}`];
  if (!focusedWord || !focusedWord.position) {
    return null;
  }
  
  // Get raw positions
  const playerX = player.position[0];
  const playerY = player.position[1];
  const wordX = focusedWord.position[0];
  const wordY = focusedWord.position[1];
  
  // Calculate angle for rotation
  const angle = Math.atan2(wordY - playerY, wordX - playerX) * (180 / Math.PI);
  
  // Calculate direction unit vector for offset calculations
  const directionX = Math.cos(angle * Math.PI / 180);
  const directionY = Math.sin(angle * Math.PI / 180);
  
  // Apply offsets to start and end positions
  const adjustedPlayerX = playerX + directionX * startOffset + startXOffset;
  const adjustedPlayerY = playerY + directionY * startOffset;
  
  // Adjust end position (move it closer to the player by endOffset)
  const adjustedWordX = wordX - directionX * endOffset + endXOffset;
  const adjustedWordY = wordY - directionY * endOffset;
  
  // Calculate distance between adjusted points
  const distance = Math.sqrt(
    Math.pow(adjustedWordX - adjustedPlayerX, 2) + Math.pow(adjustedWordY - adjustedPlayerY, 2)
  );
  
  return (
    <Animated.View
      style={[
        styles.laser,
        {
          width: distance,
          left: adjustedPlayerX,
          top: adjustedPlayerY,
          opacity: opacityAnim,
          transform: [
            { rotate: `${angle}deg` },
          ],
        }
      ]}
    />
  );
};

const styles = StyleSheet.create({
  laser: {
    position: 'absolute',
    height: LASER_THICKNESS,
    backgroundColor: LASER_COLOR,
    transformOrigin: '0 0',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    shadowColor: LASER_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5, // For Android
    zIndex: 1000, // Make sure laser is visible above other elements
  }
});

export default Laser;
