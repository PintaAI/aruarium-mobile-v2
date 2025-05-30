import { create } from 'zustand';

export interface WordCard {
  id: string;
  korean: string;
  english: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  gameStatus: 'idle' | 'playing' | 'paused' | 'gameOver' | 'completed';
  words: WordCard[];
  matchedPairs: number;
  flippedCards: string[];
  timer: number;
  score: number;
  level: number;
  totalPairs: number;
  gameStartTime: number | null;
  bestTime: number | null;
}

interface GameStore extends GameState {
  // Actions
  setGameStatus: (status: GameState['gameStatus']) => void;
  initializeGame: (wordPairs: { korean: string; english: string }[], level: number) => void;
  flipCard: (cardId: string) => void;
  incrementTimer: () => void;
  calculateScore: () => void;
  resetGame: () => void;
  setLevel: (level: number) => void;
  checkMatch: () => void;
}

const initialState: GameState = {
  gameStatus: 'idle',
  words: [],
  matchedPairs: 0,
  flippedCards: [],
  timer: 0,
  score: 0,
  level: 1,
  totalPairs: 0,
  gameStartTime: null,
  bestTime: null,
};

export const useMatchkorStore = create<GameStore>((set, get) => ({
  ...initialState,

  setGameStatus: (status) => set({ gameStatus: status }),

  setLevel: (level) => set({ level }),

  initializeGame: (wordPairs, level) => {
    const shuffledPairs = [...wordPairs];
    
    // Create cards array with both Korean and English cards
    const cards: WordCard[] = [];
    
    shuffledPairs.forEach((pair, index) => {
      // Korean card
      cards.push({
        id: `korean-${index}`,
        korean: pair.korean,
        english: pair.english,
        isFlipped: false,
        isMatched: false,
      });
      
      // English card
      cards.push({
        id: `english-${index}`,
        korean: pair.korean,
        english: pair.english,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle the cards array
    const shuffledCards = cards.sort(() => Math.random() - 0.5);

    set({
      words: shuffledCards,
      totalPairs: wordPairs.length,
      matchedPairs: 0,
      flippedCards: [],
      timer: 0,
      score: 0,
      level,
      gameStatus: 'playing',
      gameStartTime: Date.now(),
    });
  },

  flipCard: (cardId) => {
    const state = get();
    if (state.gameStatus !== 'playing') return;
    
    const { words, flippedCards } = state;
    
    // Don't flip if card is already flipped or matched
    const card = words.find(w => w.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;
    
    // Don't flip if already have 2 cards flipped
    if (flippedCards.length >= 2) return;

    const newWords = words.map(word =>
      word.id === cardId ? { ...word, isFlipped: true } : word
    );

    const newFlippedCards = [...flippedCards, cardId];

    set({
      words: newWords,
      flippedCards: newFlippedCards,
    });

    // Check for match if 2 cards are flipped
    if (newFlippedCards.length === 2) {
      setTimeout(() => {
        get().checkMatch();
      }, 1000); // Give time to see both cards
    }
  },

  checkMatch: () => {
    const state = get();
    const { words, flippedCards } = state;
    
    if (flippedCards.length !== 2) return;

    const [firstCardId, secondCardId] = flippedCards;
    const firstCard = words.find(w => w.id === firstCardId);
    const secondCard = words.find(w => w.id === secondCardId);

    if (!firstCard || !secondCard) return;

    // Check if cards match (same Korean-English pair but different card types)
    const isMatch = firstCard.korean === secondCard.korean && 
                   firstCard.english === secondCard.english &&
                   firstCardId !== secondCardId;

    if (isMatch) {
      // Mark cards as matched
      const newWords = words.map(word => {
        if (word.id === firstCardId || word.id === secondCardId) {
          return { ...word, isMatched: true };
        }
        return word;
      });

      const newMatchedPairs = state.matchedPairs + 1;
      
      set({
        words: newWords,
        flippedCards: [],
        matchedPairs: newMatchedPairs,
      });

      // Check if game is completed
      if (newMatchedPairs === state.totalPairs) {
        get().calculateScore();
        set({ gameStatus: 'completed' });
      }
    } else {
      // Flip cards back
      const newWords = words.map(word => {
        if (word.id === firstCardId || word.id === secondCardId) {
          return { ...word, isFlipped: false };
        }
        return word;
      });

      set({
        words: newWords,
        flippedCards: [],
      });
    }
  },

  incrementTimer: () => {
    const state = get();
    if (state.gameStatus === 'playing') {
      set({ timer: state.timer + 1 });
    }
  },

  calculateScore: () => {
    const state = get();
    const { timer, level, totalPairs } = state;
    
    // Base score calculation: faster completion = higher score
    const baseScore = totalPairs * 100;
    const timeBonus = Math.max(0, (300 - timer) * level); // 5 minutes max, level multiplier
    const levelBonus = level * 50;
    
    const finalScore = baseScore + timeBonus + levelBonus;
    
    set({ 
      score: finalScore,
      bestTime: state.bestTime === null || timer < state.bestTime ? timer : state.bestTime,
    });
  },

  resetGame: () => set(initialState),
}));
