import React, { useEffect } from 'react';
import { TouchableOpacity, View, Dimensions, Image } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolate 
} from 'react-native-reanimated';
import { Text } from '~/components/ui/text';
import { cn } from '~/lib/utils';
import { WordCard } from '../store/gameStore';

interface FlipCardProps {
  card: WordCard;
  onFlip: (cardId: string) => void;
  size?: 'small' | 'medium' | 'large';
}

const { width: screenWidth } = Dimensions.get('window');

export default function FlipCard({ card, onFlip, size = 'medium' }: FlipCardProps) {
  const { id, korean, english, isFlipped, isMatched } = card;
  
  // Determine if this is a Korean or English card
  const isKoreanCard = id.startsWith('korean-');
  const displayText = isKoreanCard ? korean : english;
  
  // Animation values
  const rotateY = useSharedValue(0);
  
  // Update rotation when card flips
  useEffect(() => {
    rotateY.value = withTiming(isFlipped || isMatched ? 180 : 0, {
      duration: 150,
    });
  }, [isFlipped, isMatched]);
  
  // Animated styles for front and back
  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotateY.value, [0, 180], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateValue}deg` }],
      backfaceVisibility: 'hidden',
    };
  });
  
  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotateY.value, [0, 180], [180, 360]);
    return {
      transform: [{ rotateY: `${rotateValue}deg` }],
      backfaceVisibility: 'hidden',
    };
  });
  
  // Card size calculations based on screen width and number of cards
  const getCardDimensions = () => {
    const baseWidth = screenWidth - 32; // Account for padding
    const cardWidth = Math.min((baseWidth / 4) - 8, 80); // 4 cards per row with gaps
    
    switch (size) {
      case 'small':
        return { width: 60, height: 80 };
      case 'large':
        return { width: 100, height: 120 };
      default:
        return { width: cardWidth, height: cardWidth * 1.2 };
    }
  };

  const cardDimensions = getCardDimensions();

  return (
    <TouchableOpacity
      onPress={() => onFlip(id)}
      disabled={isFlipped || isMatched}
      activeOpacity={0.7}
      style={{
        width: cardDimensions.width,
        height: cardDimensions.height,
      }}
      className="m-1"
    >
      {/* Card Back */}
      <Animated.View
        style={[
          frontAnimatedStyle,
          {
            position: 'absolute',
            width: '100%',
            height: '100%',
          }
        ]}
        className="justify-center items-center rounded-lg border-2 bg-primary dark:bg-primary border-border dark:border-border"
      >
        <Image 
          source={require('~/assets/images/icon.png')}
          style={{
            width: cardDimensions.width * 0.5,
            height: cardDimensions.width * 0.5,
          }}
          resizeMode="contain"
        />
      </Animated.View>
      
      {/* Card Front */}
      <Animated.View
        style={[
          backAnimatedStyle,
          {
            position: 'absolute',
            width: '100%',
            height: '100%',
          }
        ]}
        className={cn(
          'justify-center items-center rounded-lg border-2 p-2',
          isMatched 
            ? 'bg-green-100 dark:bg-green-900 border-green-500 dark:border-green-400 opacity-60'
            : isKoreanCard 
            ? 'bg-purple-100 dark:bg-purple-900 border-purple-500 dark:border-purple-400'
            : 'bg-blue-100 dark:bg-blue-900 border-blue-500 dark:border-blue-400'
        )}
      >
        <Text 
          className={cn(
            "text-center font-bold text-xs",
            isKoreanCard ? "text-purple-700 dark:text-purple-200" : "text-blue-700 dark:text-blue-200",
            isMatched && "text-green-700 dark:text-green-200"
          )}
          numberOfLines={3}
          adjustsFontSizeToFit
        >
          {displayText}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}
