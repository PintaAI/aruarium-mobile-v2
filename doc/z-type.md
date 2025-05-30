# Z-Type Game Documentation

## Overview
Z-Type is a typing-based arcade game where Korean vocabulary words fall from the top of the screen, and players must type the English meanings to destroy them before they reach the player. The game uses an Entity-Component-System (ECS) architecture built with React Native Game Engine.

## Game Architecture

### Directory Structure
```
mobile/lib/game/z-type/
├── entities/          # Game object components
│   ├── Player.tsx     # Player ship entity
│   └── Word.tsx       # Falling word entities
├── store/             # Game state management
│   └── gameStore.ts   # Zustand store for game state
└── systems/           # Game logic systems
    └── MovementSystem.ts # Movement and collision logic
```

### Main Game File
- `mobile/app/game/z-type.tsx` - Main game component that orchestrates everything

## Core Components

### 1. Player Entity (`entities/Player.tsx`)
**Purpose**: Renders the player ship at the bottom of the screen

**Key Features**:
- Displays as a diamond symbol (⧋)
- Positioned at bottom center of screen
- Rotates to face the currently targeted word
- Customizable color and rotation

**Props**:
```typescript
interface PlayerProps {
  position: [number, number];  // X, Y coordinates
  rotation: number;            // Rotation in degrees
  color: string;              // Player color
}
```

### 2. Word Entity (`entities/Word.tsx`)
**Purpose**: Renders falling Korean vocabulary words with their English meanings

**Key Features**:
- Displays Korean word at top, English meaning below
- Animated visual feedback for matching input
- Glow effects and scaling animations
- Support for "superwords" with special perks
- Highlighting of matched text portions

**Props**:
```typescript
interface WordProps {
  position: [number, number];  // X, Y coordinates
  color: string;              // Word color
  name: string;               // Korean word
  meaning: string;            // English translation
  isFocused?: boolean;        // Currently targeted word
  isMatching?: boolean;       // Input matches meaning
  matchType?: 'name' | 'meaning';
  wordId?: string;           // Unique identifier
  isSuperword?: boolean;     // Special word with perks
}
```

**Visual Effects**:
- **Focus state**: Scale up and background highlight
- **Matching state**: Green glow effect with animated border
- **Input highlighting**: Matched portion shown in green
- **Superword**: Golden star indicator and amber border

### 3. Game Store (`store/gameStore.ts`)
**Purpose**: Centralized state management using Zustand

**State Properties**:
```typescript
interface GameState {
  inputText: string;           // Current user input
  focusedWordId: string | null; // Currently targeted word
  score: number;               // Player score
  streak: number;              // Consecutive correct answers
  level: number;               // Current difficulty level (1-5)
  isRunning: boolean;          // Game active state
  isGameOver: boolean;         // Game over state
  superwordId: string | null;  // Current superword ID
  perkActive: 'reveal_meaning' | 'slowmotion' | null; // Active perk
  perkTimeout: number | null;  // Perk expiration timer
}
```

**Key Actions**:
- `setInputText()` - Update user input
- `incrementScore()` - Add points
- `incrementLevel()` - Advance difficulty
- `reset()` - Reset all game state

### 4. Movement System (`systems/MovementSystem.ts`)
**Purpose**: Core game logic handling movement, collisions, and input matching

**Key Responsibilities**:
- Word movement toward player
- Input matching against word meanings
- Collision detection
- Score calculation and level progression
- Superword and perk management
- Player rotation toward focused word

**Game Constants**:
```typescript
const SCORE_PER_WORD = 10;
const SCORE_PER_SUPERWORD = 30;
const STREAK_THRESHOLD_FOR_LEVEL_UP = 10;
const SUPERWORD_CHANCE = 0.3; // 30% chance
const PERK_DURATION = 10000; // 10 seconds
```

## Game Flow

### 1. Game Initialization
1. Player starts at bottom center of screen
2. Words spawn at random positions in top third of screen
3. Each word has random speed based on current level
4. Game engine begins movement system updates

### 2. Gameplay Loop
1. **Word Movement**: Words move toward player using calculated direction
2. **Input Matching**: System checks if user input matches any word's English meaning
3. **Visual Feedback**: Matching words get focus and glow effects
4. **Player Rotation**: Player rotates to face the currently focused word
5. **Collision Detection**: Game ends if word touches player

### 3. Scoring System
- **Regular Word**: 10 points
- **Superword**: 40 points (10 + 30 bonus)
- **Streak System**: 10 consecutive correct answers = level up (max level 5)
- **Level Reset**: Streak resets to 0 after leveling up

### 4. Superword System
- 30% chance for any completed word to become a superword
- Only one superword exists at a time
- Completing a superword activates a random perk:
  - `reveal_meaning`: Shows English meanings on all words
  - `slowmotion`: Reduces word movement speed by 50%
- Perks last 10 seconds

### 5. Input Matching Logic
- **Text Processing**: Input converted to lowercase for comparison
- **Partial Matching**: Words highlight when input partially matches meaning
- **Exact Matching**: Word is destroyed when input exactly matches meaning
- **Focus Management**: First matching word becomes focused (green glow)
- **Auto-clear**: Input clears automatically on exact match

## Visual Design

### Styling System
- Uses NativeWind (Tailwind CSS for React Native)
- Consistent color scheme with primary/secondary colors
- Responsive design with gap-based spacing

### Animation Features
- **React Native Reanimated**: Smooth scaling and opacity transitions
- **Spring Animations**: Natural feel for focus state changes
- **Glow Effects**: Platform-specific shadow implementations
- **Text Highlighting**: Real-time visual feedback for input matching

### Platform Considerations
- **iOS**: Uses shadow effects for glow
- **Android**: Uses elevation for glow effects
- Different player positioning offsets per platform

## Performance Optimizations

### Entity Management
- Efficient position updates using shared values
- Selective re-rendering based on state changes
- Optimized collision detection with distance calculations

### Animation Performance
- Hardware-accelerated animations via React Native Reanimated
- Minimal re-renders through proper state management
- Debounced input processing

## Integration Points

### Word Data Source
- Supports both API and static word collections
- Configurable word quantity and difficulty
- Collection title tracking for analytics

### Navigation
- Uses Expo Router for screen transitions
- Proper cleanup on game exit
- State preservation across screen changes

## Game States

### Start Screen
- Word collection selection
- Difficulty/quantity options
- Game instructions

### Active Gameplay
- Real-time typing interface
- Live score and level display
- Visual feedback for all interactions

### Game Over
- Final score display
- Options to restart or try again
- Return to word selection

## Technical Implementation

### Dependencies
- `react-native-game-engine`: Core game loop and entity management
- `react-native-reanimated`: Smooth animations and transitions
- `zustand`: Lightweight state management
- `expo-router`: Navigation and routing

### Architecture Benefits
- **Modularity**: Clear separation of entities, systems, and state
- **Maintainability**: Each component has single responsibility
- **Extensibility**: Easy to add new word types, perks, or game modes
- **Performance**: Optimized for smooth 60fps gameplay

This architecture demonstrates modern React Native game development patterns with clean separation of concerns and efficient state management.
