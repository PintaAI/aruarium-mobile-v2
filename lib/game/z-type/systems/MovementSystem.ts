import { useGameStore } from '../store/gameStore';

// Define types
interface Entities {
  [key: string]: any;
}

// Game constants
const SCORE_PER_WORD = 10;
const SCORE_PER_SUPERWORD = 30; // Extra score for superwords
const STREAK_THRESHOLD_FOR_LEVEL_UP = 10;
const SUPERWORD_CHANCE = 0.3; // 30% chance for a word to become a superword
const PERK_DURATION = 10000; // Perk duration in milliseconds (10 seconds)

// Helper types
type Position = [number, number];

/**
 * Calculate distance between two positions
 */
const calculateDistance = (pos1: Position, pos2: Position): number => {
  const dx = pos2[0] - pos1[0];
  const dy = pos2[1] - pos1[1];
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Check if there's a collision between two entities
 */
const checkCollision = (pos1: Position, pos2: Position, threshold: number): boolean => {
  return calculateDistance(pos1, pos2) < threshold;
};

/**
 * Calculate the angle in degrees between two positions
 */
const calculateAngle = (from: Position, to: Position): number => {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  // Convert radians to degrees and add 90 degrees to make 0 point upward
  return Math.atan2(dy, dx) * (180 / Math.PI);
};

/**
 * MovementSystem to handle word movement, input matching, and player rotation
 * @param entities - The game entities to update
 * @param time - Time information including delta time
 * @returns Updated game entities
 */
export const MovementSystem = (entities: Entities, { time }: { time: { delta: number } }) => {
  // Get player entity (skip processing if no player)
  const player = entities.player;
  if (!player || !player.position) return entities;
  
  // Access the game store for input state
  const gameStore = useGameStore.getState();
  const { inputText, focusedWordId, setFocusedWordId } = gameStore;
  
  
  // Track matched words and focus the first match
  let firstMatchingWord: any = null;
  let firstMatchingKey: string = '';
  let matchFound = false;
  
  // Process each word entity
  Object.keys(entities).forEach(key => {
    if (key === 'gameArea' || key === 'player') return; // Skip non-word entities
    
    const word = entities[key];
    if (!word || !word.position) return;

    // Get boundary dimensions
    const maxWidth = word.gamearea.width - 75;
    const maxHeight = word.gamearea.height - 30;
    
    // Only check if the meaning matches the input text
    const meaningMatches = inputText && word.meaning.toLowerCase().startsWith(inputText.toLowerCase());
    const meaningExactMatch = inputText && inputText.toLowerCase() === word.meaning.toLowerCase();
    
    // Set isMatching based on meaning match only
    const isMatching = meaningMatches;
    const isExactMatch = meaningExactMatch;
    
    word.isMatching = isMatching;
    word.matchType = 'meaning';
    
    
    // Track the first matching word for focusing
    if (isMatching && !matchFound) {
      firstMatchingWord = word;
      firstMatchingKey = key;
      matchFound = true;
    }
    
    // Check if this is the focused word
    const wordId = key.replace('word-', '');
    const isFocused = wordId === focusedWordId;
    word.isFocused = isFocused;
    word.wordId = wordId;
    
    // If there's an exact match, reset the word to a random position above the screen
    if (isExactMatch) {
      // Get current game state
      const { 
        incrementScore, 
        setStreak, 
        streak, 
        level, 
        incrementLevel,
        superwordId,
        setSuperwordId,
        setPerkActive,
        setPerkTimeout,
        perkTimeout,
        perkActive
      } = useGameStore.getState();
      
      // Check if this word is already a superword
      const isSuperwordMatch = wordId === superwordId;
      
      // Apply score and streak
      if (isSuperwordMatch) {
        // Extra points for superword
        incrementScore(SCORE_PER_WORD + SCORE_PER_SUPERWORD);
        
        // Activate a random perk
        const perks: ('reveal_meaning' | 'slowmotion')[] = ['reveal_meaning', 'slowmotion'];
        const randomPerk = perks[Math.floor(Math.random() * perks.length)];
        
        // Set the active perk and clear any existing timeout
        setPerkActive(randomPerk);
        if (perkTimeout !== null) {
          // If perkTimeout is a number greater than 1000000000000, it's a timestamp not a timeout ID
          if (typeof perkTimeout === 'number' && perkTimeout > 1000000000000) {
            // Do nothing with the old timestamp
          } else {
            // Clear the timeout if it's an actual timeout ID
            clearTimeout(perkTimeout as unknown as number);
          }
        }
        
        // Store current timestamp when perk was activated
        setPerkTimeout(Date.now());
        
        // Create a new timeout to clear the perk after duration
        window.setTimeout(() => {
          useGameStore.setState({ perkActive: null, perkTimeout: null });
        }, PERK_DURATION);
        
        // Clear superword
        setSuperwordId(null);
      } else {
        // Regular word score
        incrementScore(SCORE_PER_WORD);
        
        // Randomly determine if this becomes a superword
        // Don't create a new superword if one already exists
        if (!superwordId && Math.random() < SUPERWORD_CHANCE) {
          setSuperwordId(wordId);
          // Mark the word as a superword
          word.isSuperword = true;
        }
      }
      
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      // Level up if streak threshold is reached
      if (newStreak >= STREAK_THRESHOLD_FOR_LEVEL_UP) {
        // Only level up if not already at max level (5)
        if (level < 5) {
          incrementLevel();
        }
        // Reset streak after level up
        setStreak(0);
      }
      
      word.position[0] = Math.random() * maxWidth;
      // Reset to random negative value between -30 and 0
      word.position[1] = -Math.random() * 150;
      // Clear input on exact match
      useGameStore.setState({ inputText: '' });
      return; // Skip further processing for this word
    }
    
    // Calculate direction towards player
    const dx = player.position[0] - word.position[0];
    const dy = player.position[1] - word.position[1];
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Normalize direction and apply speed
    const baseSpeed = word.velocity[1]; // Use original vertical speed as base speed
    const dirX = (dx / distance) * baseSpeed * 0.5; // Horizontal movement is slower
    const dirY = (dy / distance) * baseSpeed;
    
    // Apply slowmotion perk if active
    const { perkActive } = useGameStore.getState();
    const speedMultiplier = perkActive === 'slowmotion' ? 0.5 : 1.0; // 50% speed if slowmotion active

    // Mark as superword if this is the current superword
    const { superwordId } = useGameStore.getState();
    word.isSuperword = wordId === superwordId;
    
    // Move word towards player with speed adjustment for slowmotion perk
    word.position[0] += dirX * (time.delta / 15) * speedMultiplier;
    word.position[1] += dirY * (time.delta / 15) * speedMultiplier;
    
    // Check for collision with player
    if (checkCollision(word.position, player.position, 30)) {
      // Trigger game over
      const { setIsGameOver } = useGameStore.getState();
      setIsGameOver(true);
      return; // Stop further processing
    }
    
  });
  
  // Update focused word ID in the store if it changed
  if (matchFound) {
    const newFocusedId = firstMatchingKey.replace('word-', '');
    if (focusedWordId !== newFocusedId) {
      setFocusedWordId(newFocusedId);
    }
    
    // Rotate player to face the focused word
    if (firstMatchingWord) {
      // Calculate angle and add 40 degrees offset
      const targetAngle = calculateAngle(player.position, firstMatchingWord.position) + 90;
      // Smooth rotation by interpolating between current and target angle
      const currentAngle = player.rotation || 0;
      const angleDifference = targetAngle - currentAngle;
      
      // Normalize angle difference to be between -180 and 180
      let normalizedDiff = angleDifference;
      if (normalizedDiff > 180) normalizedDiff -= 360;
      if (normalizedDiff < -180) normalizedDiff += 360;
      
      // Apply smooth rotation with damping factor
      player.rotation = currentAngle + normalizedDiff * 0.1 * (time.delta / 15);
    }
  } else if (focusedWordId) {
    // Clear focus if no matches found
    setFocusedWordId(null);
  }

  return entities;
};

export default MovementSystem;
