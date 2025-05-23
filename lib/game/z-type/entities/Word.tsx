import React from 'react';
import { View, Platform } from 'react-native';
import { useGameStore } from '../store/gameStore';
import Animated, { 
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withRepeat
} from 'react-native-reanimated';
import { Text } from '~/components/ui/text';

// Constants
const LASER_COLOR = '#00FF00';

// Define types for the component props
export interface WordProps {
  position: [number, number];
  color: string;
  name: string;
  meaning: string;
  isFocused?: boolean;
  isMatching?: boolean;
  matchType?: 'name' | 'meaning';
  wordId?: string;
  isSuperword?: boolean;
}

/**
 * Custom hook for managing word animations
 */
const useWordAnimations = (
  isFocused: boolean,
  inputText: string,
  showMeaning: boolean,
  isMeaningMatch: boolean // Added isMeaningMatch parameter
) => {
  // Animation values
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);
  const meaningOpacity = useSharedValue(0);
  const meaningHeight = useSharedValue(0);
  const borderPulse = useSharedValue(0); // New shared value for border animation
  const prevInputTextRef = React.useRef('');

  // Animated styles for scale
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  // Glow effect style - matching laser intensity with platform-specific implementation
  const animatedGlowStyle = useAnimatedStyle(() => {
    // Common styles for both platforms
    const commonStyles = {
      // backgroundColor controlled by glowOpacity, border controlled by borderPulse
      backgroundColor: `rgba(0, 255, 0, ${glowOpacity.value * 0.2})`, 
      borderWidth: borderPulse.value, 
      borderColor: LASER_COLOR,
    };

    // Platform specific shadow implementation
    if (Platform.OS === 'ios') {
      return {
        ...commonStyles,
        shadowColor: LASER_COLOR,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: glowOpacity.value * 0.8, // Match laser shadowOpacity
        shadowRadius: 4, // Match laser shadowRadius
      };
    } else {
      // Android - only use elevation
      return {
        ...commonStyles,
        elevation: glowOpacity.value * 5, // For Android
      };
    }
  });

  // Effect to handle focus state changes (only scale and background)
  React.useEffect(() => {
    if (isFocused) {
      scale.value = withSequence(
        withTiming(1.08, { duration: 150 }),
        withSpring(1.03, { damping: 15 })
      );
      // Glow and border are now handled by isMeaningMatch
    } else {
      scale.value = withSpring(1, { damping: 15 });
    }
  }, [isFocused, scale]);

  // Effect to handle meaning match for glow and border (set base state)
  React.useEffect(() => {
    if (isMeaningMatch) {
      glowOpacity.value = withTiming(0.7, { duration: 200 }); // Set base glow
      borderPulse.value = withTiming(1, { duration: 200 });   // Set base border to 1px
    } else {
      glowOpacity.value = withTiming(0, { duration: 200 });
      borderPulse.value = withTiming(0, { duration: 200 });   // Reset border to 0px
    }
  }, [isMeaningMatch]); // This effect only depends on isMeaningMatch to set the state
  
  // Effect to handle input text changes (pulse glow and border if matching)
  React.useEffect(() => {
    if (prevInputTextRef.current !== inputText) {
      prevInputTextRef.current = inputText || '';

      if (isMeaningMatch) { // Only pulse if currently matching
        // Pulse glow
        glowOpacity.value = withSequence(
          withTiming(1, { duration: 100 }),    // Brighter
          withTiming(0.7, { duration: 200 })  // Back to base matching glow (0.7)
        );
        // Pulse border
        borderPulse.value = withSequence(
          withTiming(2, { duration: 100 }),    // Thicker (e.g. 2px)
          withTiming(1, { duration: 200 })   // Back to base matching border (1px)
        );
      }
    }
  }, [inputText, isMeaningMatch, glowOpacity, borderPulse]); // Ensure all animated values are dependencies
  
  // Function to animate partial and exact matches
  const animateMatch = (isMeaningMatch: boolean, isExactMatch: boolean) => {
    if (!isMeaningMatch) return;
    
    if (isExactMatch) {
      // Celebrate animation when exact match
      scale.value = withSequence(
        withTiming(1.2, { duration: 100 }),
        withTiming(0.8, { duration: 100 }),
        withTiming(1, { duration: 150 })
      );
    } else {
      // Pulse animation when partial match
      scale.value = withSequence(
        withTiming(1.04, { duration: 100 }),
        withTiming(1, { duration: 300 })
      );
    }
  };
  
  // Animated style for meaning container with opacity and height
  const animatedMeaningStyle = useAnimatedStyle(() => {
    return {
      opacity: meaningOpacity.value,
      height: meaningHeight.value,
      overflow: 'hidden',
    };
  });

  // Effect to handle showing/hiding meaning
  React.useEffect(() => {
    if (showMeaning) {
      // Animate in
      meaningOpacity.value = withTiming(1, { duration: 200 });
      meaningHeight.value = withTiming(10, { duration: 250 }); // Approximate height of text
    } else {
      // Animate out
      meaningOpacity.value = withTiming(0, { duration: 150 });
      meaningHeight.value = withTiming(0, { duration: 200 });
    }
  }, [showMeaning, meaningOpacity, meaningHeight]);
  
  return {
    animatedStyles,
    animatedGlowStyle,
    animatedMeaningStyle,
    animateMatch
  };
};

/**
 * Component for displaying highlighted text with matched and remaining portions
 */
const HighlightedText: React.FC<{
  meaning: string;
  inputText: string;
  isMeaningMatch: boolean;
}> = ({ meaning, inputText, isMeaningMatch }) => {
  if (!isMeaningMatch) {
    return <Text className="text-primary/80 text-xs">{meaning}</Text>;
  }
  
  const matchedPortion = meaning.substring(0, inputText.length);
  const remainingPortion = meaning.substring(inputText.length);
  
  return (
    <View className="flex-row items-center">
      <Text className="text-green-500 text-xs font-bold">{matchedPortion}</Text>
      <Text className="text-primary/80 text-xs">{remainingPortion}</Text>
    </View>
  );
};


/**
 * Word component to render a word entity in the Z-Type game
 * Enhanced with animations and improved visual feedback
 */
export const Word = (props: WordProps) => {
  const { 
    position, 
    name, 
    meaning, 
    isFocused = false, 
    isSuperword = false 
  } = props;
  
  const { inputText, level, perkActive } = useGameStore();
  
  // Determine if meaning matches the current input
  const isMeaningMatch = inputText && meaning.toLowerCase().startsWith(inputText.toLowerCase());
  const isExactMatch = inputText && inputText.toLowerCase() === meaning.toLowerCase();
  
  // Determine whether to show the meaning
  const showMeaning = perkActive === 'reveal_meaning' || !!isFocused;
  
  // Get animation hooks
  const {
    animatedStyles,
    animatedGlowStyle,
    animatedMeaningStyle,
    animateMatch
  } = useWordAnimations(isFocused, inputText, showMeaning, !!isMeaningMatch); // Pass isMeaningMatch
  
  // Update animations for matching state changes
  React.useEffect(() => {
    animateMatch(!!isMeaningMatch, !!isExactMatch);
  }, [animateMatch, isMeaningMatch, isExactMatch]);
  
  return (
    <Animated.View 
      style={[
        {
          position: 'absolute',
          left: position[0],
          top: position[1],
        },
        animatedStyles,
        animatedGlowStyle
      ]}
      className={`
        px-2 py-1 rounded-md flex justify-center items-center
        ${isFocused ? 'bg-primary/20' : 'bg-secondary/10'}
        ${isSuperword ? 'border-2 border-amber-400 bg-amber-500/10' : ''}
      `}
    >
      {/* Level indicator for higher level words */}
     
      
      {/* Korean word display */}
      <View>
        <Text className="text-xs font-bold text-primary">{name}</Text>
      </View>
      
      {/* Meaning display with match highlighting - always rendered but animated in/out */}
      <Animated.View style={animatedMeaningStyle}>
        <HighlightedText 
          meaning={meaning} 
          inputText={inputText || ''} 
          isMeaningMatch={!!isMeaningMatch} 
        />
      </Animated.View>
      
      {/* Superword indicator */}
      {isSuperword && (
        <View className="absolute -top-2 -right-3">
          <Text className="text-[10px] text-amber-500 font-bold">★</Text>
        </View>
      )}
    </Animated.View>
  );
};

export default Word;
