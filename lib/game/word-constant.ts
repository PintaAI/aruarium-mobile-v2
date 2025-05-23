/**
 * Constants and helpers for word-based games
 */

// Word item interface
export interface WordItem {
  id: string;
  name: string;
  meaning: string;
}

// Word collection - Korean words with Indonesian meanings
export const WORD_COLLECTION: WordItem[] = [
  { id: 'w1', name: "안녕하세요", meaning: "Halo" },
  { id: 'w2', name: "감사합니다", meaning: "Terima kasih" },
  { id: 'w3', name: "사랑해요", meaning: "Aku cinta kamu" },
  { id: 'w4', name: "물", meaning: "Air" },
  { id: 'w5', name: "음식", meaning: "Makanan" },
  { id: 'w6', name: "집", meaning: "Rumah" },
  { id: 'w7', name: "학교", meaning: "Sekolah" },
  { id: 'w8', name: "친구", meaning: "Teman" },
  { id: 'w9', name: "가족", meaning: "Keluarga" },
  { id: 'w10', name: "시간", meaning: "Waktu" },
  { id: 'w11', name: "돈", meaning: "Uang" },
  { id: 'w12', name: "책", meaning: "Buku" },
  { id: 'w13', name: "전화", meaning: "Telepon" },
  { id: 'w14', name: "컴퓨터", meaning: "Komputer" },
  { id: 'w15', name: "언어", meaning: "Bahasa" }
];

// Game speed constants by level
export const GAME_SPEEDS = {
  INITIAL: 0.05,
  LEVELS: {
    1: { min: 0.05, max: 0.3 },
    2: { min: 0.15, max: 0.5 },
    3: { min: 0.25, max: 0.75 },
    4: { min: 0.35, max: 1.0 },
    5: { min: 0.5, max: 1.5 }
  }
};

/**
 * Get a random selection of words from the collection
 * @param quantity Number of words to select
 * @returns Array of random words
 */
export const getRandomWords = (quantity: number): WordItem[] => {
  // Shuffle the collection
  const shuffled = [...WORD_COLLECTION].sort(() => 0.5 - Math.random());
  // Get the first n elements (or all if quantity > length)
  return shuffled.slice(0, Math.min(quantity, shuffled.length));
};

/**
 * Get a random speed within the specified level's range
 * @param level Game difficulty level (1-5)
 * @returns Random speed value
 */
export const getRandomSpeed = (level: 1 | 2 | 3 | 4 | 5 = 2): number => {
  const { min, max } = GAME_SPEEDS.LEVELS[level];
  return min + Math.random() * (max - min);
};
