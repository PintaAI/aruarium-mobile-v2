import { WordItem, getRandomWords } from '~/lib/game/word-constant';

export interface MatchkorWordPair {
  korean: string;
  english: string;
}

/**
 * Convert WordItem array to Matchkor word pairs
 * @param words Array of WordItem
 * @returns Array of MatchkorWordPair
 */
export const convertToWordPairs = (words: WordItem[]): MatchkorWordPair[] => {
  return words.map(word => ({
    korean: word.name,
    english: word.meaning,
  }));
};

/**
 * Get random word pairs for Matchkor game based on level
 * @param level Game level (1-5)
 * @returns Array of MatchkorWordPair
 */
export const getMatchkorWords = (level: number): MatchkorWordPair[] => {
  // Define word quantities based on level
  const wordQuantities = {
    1: 4,   // 4 pairs = 8 cards
    2: 6,   // 6 pairs = 12 cards  
    3: 8,   // 8 pairs = 16 cards
    4: 10,  // 10 pairs = 20 cards
    5: 12,  // 12 pairs = 24 cards
  };

  const quantity = wordQuantities[level as keyof typeof wordQuantities] || 6;
  const randomWords = getRandomWords(quantity);
  return convertToWordPairs(randomWords);
};

/**
 * Get word pairs from provided WordItem array
 * @param words Array of WordItem from API or selection
 * @returns Array of MatchkorWordPair
 */
export const getWordPairsFromSelection = (words: WordItem[]): MatchkorWordPair[] => {
  return convertToWordPairs(words);
};
