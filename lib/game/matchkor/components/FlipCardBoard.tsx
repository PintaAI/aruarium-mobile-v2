import React from 'react';
import { View } from 'react-native';
import { useMatchkorStore } from '../store/gameStore';
import FlipCard from './FlipCard';


export default function FlipCardBoard() {
  const { words, flipCard } = useMatchkorStore();
  
  // Calculate optimal grid layout based on number of cards
  const getGridLayout = (totalCards: number) => {
    if (totalCards <= 8) return { columns: 4, rows: 2 };
    if (totalCards <= 12) return { columns: 4, rows: 3 };
    if (totalCards <= 16) return { columns: 4, rows: 4 };
    if (totalCards <= 20) return { columns: 4, rows: 4 };
    return { columns: 6, rows: Math.ceil(totalCards / 6) };
  };

  const { columns, rows } = getGridLayout(words.length);
  
  // Split cards into rows
  const cardRows = [];
  for (let i = 0; i < words.length; i += columns) {
    cardRows.push(words.slice(i, i + columns));
  }

  return (
    <View className="flex-1 justify-center items-center px-4 py-4">
      <View className="gap-2">
        {cardRows.map((row, rowIndex) => (
          <View key={rowIndex} className="flex-row justify-center gap-2">
            {row.map((card) => (
              <FlipCard
                key={card.id}
                card={card}
                onFlip={flipCard}
                size={words.length > 20 ? 'small' : 'medium'}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
