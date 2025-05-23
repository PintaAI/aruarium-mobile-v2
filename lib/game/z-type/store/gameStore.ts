import { create } from 'zustand';

interface GameState {
  inputText: string;
  focusedWordId: string | null;
  score: number;
  streak: number;
  level: number;
  isRunning: boolean;
  isGameOver: boolean;
  // Superword and perk state
  superwordId: string | null;
  perkActive: 'reveal_meaning' | 'slowmotion' | null;
  perkTimeout: number | null;
  // Methods
  setInputText: (text: string) => void;
  setFocusedWordId: (id: string | null) => void;
  setScore: (score: number) => void;
  setStreak: (streak: number) => void;
  setLevel: (level: number) => void;
  incrementScore: (amount: number) => void;
  incrementLevel: () => void;
  setIsRunning: (isRunning: boolean) => void;
  setIsGameOver: (isGameOver: boolean) => void;
  setSuperwordId: (id: string | null) => void;
  setPerkActive: (perk: 'reveal_meaning' | 'slowmotion' | null) => void;
  setPerkTimeout: (timeout: number | null) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  inputText: '',
  focusedWordId: null,
  score: 0,
  streak: 0,
  level: 1,
  isRunning: false,
  isGameOver: false,
  // Initialize superword and perk state
  superwordId: null,
  perkActive: null,
  perkTimeout: null,
  setInputText: (text) => {
    set({ inputText: text });
  },
  setFocusedWordId: (id) => {
    set({ focusedWordId: id });
  },
  setScore: (score) => {
    set({ score });
  },
  setStreak: (streak) => {
    set({ streak });
  },
  setIsRunning: (isRunning) => {
    set({ isRunning });
  },
  setIsGameOver: (isGameOver) => {
    set({ isGameOver });
  },
  setLevel: (level) => {
    set({ level });
  },
  incrementScore: (amount) => {
    set((state) => ({ score: state.score + amount }));
  },
  incrementLevel: () => {
    set((state) => ({ level: state.level + 1 }));
  },
  // Superword and perk methods
  setSuperwordId: (id) => {
    set({ superwordId: id });
  },
  setPerkActive: (perk) => {
    set({ perkActive: perk });
  },
  setPerkTimeout: (timeout) => {
    set({ perkTimeout: timeout });
  },
  reset: () => {
    set({
      inputText: '',
      focusedWordId: null,
      score: 0,
      streak: 0,
      level: 1,
      isRunning: false,
      isGameOver: false,
      superwordId: null,
      perkActive: null,
      perkTimeout: null
    });
  },
}));
