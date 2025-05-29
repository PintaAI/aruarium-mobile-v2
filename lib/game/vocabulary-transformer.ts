import { VocabularyItem } from '../api/types';
import { WordItem } from './word-constant';

/**
 * Transform VocabularyItem array from API to WordItem array for game use
 * @param items - Array of vocabulary items from API
 * @returns Array of word items for game
 */
export function transformVocabularyToWords(items: VocabularyItem[]): WordItem[] {
  return items.map(item => ({
    id: item.id.toString(),
    name: item.korean,
    meaning: item.indonesian
  }));
}

/**
 * Validate that vocabulary items are suitable for game use
 * @param items - Array of vocabulary items
 * @returns Filtered array with valid items only
 */
export function validateVocabularyItems(items: VocabularyItem[]): VocabularyItem[] {
  return items.filter(item => 
    item.korean && 
    item.korean.trim().length > 0 &&
    item.indonesian && 
    item.indonesian.trim().length > 0 &&
    item.type === 'WORD' // Only use words, not sentences for z-type game
  );
}

/**
 * Get random selection of vocabulary items
 * @param items - Array of vocabulary items
 * @param quantity - Number of items to select
 * @returns Array of randomly selected items
 */
export function getRandomVocabularyItems(items: VocabularyItem[], quantity: number): VocabularyItem[] {
  const validItems = validateVocabularyItems(items);
  const shuffled = [...validItems].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(quantity, shuffled.length));
}

/**
 * Transform and prepare vocabulary items for game use
 * @param items - Array of vocabulary items from API
 * @param quantity - Number of words needed for game
 * @returns Array of word items ready for game
 */
export function prepareWordsForGame(items: VocabularyItem[], quantity: number): WordItem[] {
  const selectedItems = getRandomVocabularyItems(items, quantity);
  return transformVocabularyToWords(selectedItems);
}
