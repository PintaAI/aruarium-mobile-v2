## Brief overview
Guidelines for developing mobile games using React Native Game Engine (RNGE) with modern tooling, focusing on word-based gameplay mechanics and responsive UI.

## Tech stack requirements
- React Native Game Engine (RNGE) for core game mechanics
- NativeWind with blur effects for UI styling
- Lucide icons with className support
- Zustand for state management
- React Native Reanimated for smooth animations

## Core development tasks
- [x] Index (Core)
  - [x] Implement keyboard height tracking hook (useKeyboard.ts)
  - [x] Create constants file for words (id, name, meaning) (constants.ts)
  - [x] Set up Zustand state management (store.ts)

- [ ] Game Engine Implementation
  - [ ] Entity System
    - [ ] Word entities with dynamic positioning and speed
    - [ ] Player entity with fixed center position and keyboard responsiveness
  - [ ] Game Systems
    - [ ] Collision detection system
    - [ ] Scoring system
    - [ ] Word movement system

- [ ] Component Development
  - [ ] Game input handling
  - [ ] Player component
  - [ ] Word display component
  - [ ] Game over screen
  - [ ] Start screen
  - [ ] HUD component
  - [ ] Development HUD

## Performance considerations
- Optimize entity updates for smooth gameplay
- Implement efficient collision detection
- Handle keyboard events responsively
- Consider mobile-specific performance implications

## Component organization
- Game screens (start, gameplay, gameover) as separate components
- HUD components for game state display
- Debug HUD for development purposes
- Input handling components for player interaction

## State management
- Use Zustand for global game state
  - Score and streak tracking
  - Game flow control (start, pause, game over)
  - Player position and rotation
  - Input handling
  - Shooting mechanics
- Maintain keyboard height tracking via custom hooks
- Store game constants in dedicated files
- Track word entities with their properties (id, word, meaning)
