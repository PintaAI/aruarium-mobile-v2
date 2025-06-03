# Daily Login Streak & Gamification System Documentation

## Overview

The Pejuang Korea mobile app features a comprehensive gamification system that rewards users for daily engagement and learning activities. The system includes daily login streaks, XP rewards, level progression, and game integration.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Database Schema](#database-schema)
3. [API Endpoints](#api-endpoints)
4. [Mobile Components](#mobile-components)
5. [React Hooks](#react-hooks)
6. [Game Integration](#game-integration)
7. [XP and Leveling System](#xp-and-leveling-system)
8. [Usage Examples](#usage-examples)
9. [Testing](#testing)

## System Architecture

### Backend Components
- **Streak API**: `/api/mobile/streak` - Main endpoint for streak management
- **Database Models**: User, ActivityLog with streak and XP tracking
- **Activity Types**: Defined enum for different user activities

### Frontend Components
- **Streak Display**: Visual components showing streak progress
- **Game Integration**: Z-type game with XP rewards
- **Hooks**: React hooks for streak management and game XP
- **Auto-tracking**: Automatic daily login detection

## Database Schema

### User Model (Streak Fields)
```prisma
model User {
  // Streak related fields
  currentStreak         Int                    @default(0)
  maxStreak             Int                    @default(0) 
  lastActivityDate      DateTime?
  // XP and Level fields
  xp                    Int                    @default(0)
  level                 Int                    @default(1)
  
  activityLogs          ActivityLog[]
}
```

### ActivityLog Model
```prisma
model ActivityLog {
  id             String           @id @default(cuid())
  userId         String
  type           ActivityType
  description    String?
  xpEarned       Int?             // XP earned from this activity
  streakUpdated  Boolean          @default(false)
  previousStreak Int?
  newStreak      Int?
  previousLevel  Int?
  newLevel       Int?
  metadata       String?          @db.Text // JSON string for additional metadata
  createdAt      DateTime         @default(now())
  user           User             @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Activity Types
```prisma
enum ActivityType {
  LOGIN                    // Daily login (10 XP)
  COMPLETE_MODULE          // Module completion (50 XP)
  COMPLETE_COURSE          // Course completion (200 XP)
  COMPLETE_QUIZ            // Quiz completion (score-based XP)
  VOCABULARY_PRACTICE      // Vocabulary practice (2 XP per word)
  DAILY_CHALLENGE          // Daily challenges (30-50 XP)
  SUBMIT_ASSIGNMENT        // Assignment submission (grade-based XP)
  PARTICIPATE_LIVE_SESSION // Live session participation (40+ XP)
  PLAY_GAME               // Game completion (performance-based XP)
  OTHER                   // Custom activities
}
```

## API Endpoints

### GET `/api/mobile/streak`
**Description**: Retrieve current user's streak data

**Response**:
```json
{
  "success": true,
  "data": {
    "currentStreak": 5,
    "maxStreak": 12,
    "lastActivityDate": "2025-06-03T07:30:00.000Z",
    "daysSinceLastActivity": 0,
    "shouldResetStreak": false,
    "xp": 1250,
    "level": 2,
    "recentActivities": [...],
    "streakStatus": {
      "isActive": true,
      "canContinueToday": true,
      "needsActivityToday": false,
      "missedDays": 0
    }
  }
}
```

### POST `/api/mobile/streak`
**Description**: Record a new activity and update streak

**Request Body**:
```json
{
  "type": "PLAY_GAME",
  "description": "Played Z-type game - Score: 1200, Level: 4, Streak: 15",
  "xpEarned": 185,
  "metadata": {
    "gameType": "z-type",
    "score": 1200,
    "level": 4,
    "streak": 15
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "streak": {
      "previous": 4,
      "current": 5,
      "max": 12,
      "updated": true
    },
    "xp": {
      "previous": 1065,
      "earned": 185,
      "current": 1250
    },
    "level": {
      "previous": 1,
      "current": 2,
      "leveledUp": true
    },
    "activity": {
      "id": "activity_123",
      "type": "PLAY_GAME",
      "description": "Played Z-type game...",
      "createdAt": "2025-06-03T07:30:00.000Z"
    }
  }
}
```

## Mobile Components

### StreakDisplay Component
**Location**: `mobile/components/StreakDisplay.tsx`

**Variants**:
- `minimal`: Simple fire emoji + streak count (🔥5)
- `compact`: Streak + level + XP in a compact card
- `full`: Detailed view with progress bars and complete information

**Usage**:
```tsx
import { StreakDisplay } from '~/components/StreakDisplay';

// In your component
<StreakDisplay variant="full" />
```

**Features**:
- Real-time streak updates
- XP progress bars
- Level advancement indicators
- Celebration animations for achievements
- Responsive design with NativeWind styling

### GameOverScreen Component
**Location**: `mobile/components/game/GameOverScreen.tsx`

**Features**:
- Displays game performance (score, level, streak)
- Shows XP earned with detailed breakdown
- Performance rating system
- Achievement notifications (streak updates, level-ups)
- Action buttons for replay/restart

## React Hooks

### useStreak Hook
**Location**: `mobile/lib/hooks/useStreak.ts`

**Main Features**:
```tsx
const {
  streakData,           // Current streak information
  isLoading,            // Loading state
  error,                // Error state
  recordLogin,          // Manual login recording
  recordActivityAction, // Record any activity
  refreshStreak,        // Refresh streak data
  hasLeveledUp,         // Level up celebration state
  shouldShowStreakCelebration // Streak celebration state
} = useStreak();
```

**Auto-Features**:
- Automatic daily login recording on app launch
- React Query integration for caching
- Celebration state management
- Authentication-aware data fetching

### useStreakDisplay Hook
**Location**: `mobile/lib/hooks/useStreak.ts`

**Simple UI Data**:
```tsx
const {
  currentStreak,  // Current streak count
  maxStreak,      // Maximum streak achieved
  level,          // Current level
  xp,             // Total XP
  xpProgress,     // Progress to next level (%)
  xpToNextLevel,  // XP needed for next level
  isActive        // Is streak currently active
} = useStreakDisplay();
```

### useGameXP Hook
**Location**: `mobile/lib/hooks/useGameXP.ts`

**Game Integration**:
```tsx
const {
  recordGameCompletion,   // Record game completion
  calculateGameXP,        // Calculate XP for performance
  getPerformanceRating,   // Get performance feedback
  hasRecordedXP,         // Has XP been recorded
  xpResult               // XP calculation result
} = useGameXP();
```

### useAutoGameXP Hook
**Location**: `mobile/lib/hooks/useGameXP.ts`

**Automatic Game Tracking**:
```tsx
const {
  xpResult,      // XP result from game
  hasEarnedXP    // Boolean if XP was earned
} = useAutoGameXP();
```

### useStreakActions Hook
**Location**: `mobile/lib/hooks/useStreakActions.ts`

**Common Learning Activities**:
```tsx
const {
  recordModuleComplete,           // Record module completion
  recordQuizComplete,            // Record quiz completion
  recordVocabPractice,           // Record vocabulary practice
  recordCourseComplete,          // Record course completion
  recordDailyChallenge,          // Record daily challenge
  recordLiveSessionParticipation, // Record live session
  recordAssignmentSubmission,    // Record assignment
  recordCustomActivity           // Record custom activity
} = useStreakActions();
```

## Game Integration

### Z-Type Game XP System

**XP Calculation Formula**:
```typescript
// Base XP calculation
let xp = 0;

// Score-based XP (1 point = 0.5 XP, minimum 5 XP)
xp += Math.max(Math.floor(score * 0.5), 5);

// Level bonus (10 XP per level reached)
xp += level * 10;

// Streak bonus (2 XP per streak point)
xp += streak * 2;

// Performance multipliers
if (score >= 1000) xp += 50; // High score bonus
if (level >= 3) xp += 30;    // Mid-level bonus
if (level >= 5) xp += 70;    // Max level bonus
if (streak >= 10) xp += 25;  // Good streak bonus
if (streak >= 20) xp += 50;  // Great streak bonus

// Cap XP at reasonable maximum
return Math.min(xp, 300);
```

**Performance Ratings**:
- Score ≥1500 + Level 5: "Legendary! 🏆"
- Score ≥1000 + Level 4: "Excellent! ⭐"
- Score ≥500 + Level 3: "Great! 🎯"
- Score ≥200 + Level 2: "Good! 👍"
- Score ≥100: "Nice Try! 💪"
- Default: "Keep Practicing! 📚"

### Auto-Detection
The system automatically detects when the Z-type game ends and records the appropriate XP based on performance.

## XP and Leveling System

### Level Calculation
```typescript
// Level formula: 1000 XP per level
const level = Math.floor(totalXP / 1000) + 1;
```

### XP Sources and Rewards

| Activity Type | XP Reward | Notes |
|---------------|-----------|-------|
| Daily Login | 10 XP | Once per day |
| Module Completion | 50 XP | Per module |
| Course Completion | 200 XP | Per course |
| Quiz Completion | Score ÷ 2 XP | Based on percentage |
| Vocabulary Practice | 2 XP per word | Per word practiced |
| Daily Challenge | 30-50 XP | Based on performance |
| Assignment | Grade ÷ 2 XP | Based on grade |
| Live Session | 40+ XP | Duration-based (2 XP/min, max 100) |
| Z-type Game | 5-300 XP | Performance-based |

### Streak Logic

| Scenario | Streak Behavior |
|----------|----------------|
| First activity ever | Streak = 1 |
| Same day activity | Streak unchanged |
| Next day activity | Streak + 1 |
| Gap > 1 day | Streak resets to 1 |

## Usage Examples

### Basic Streak Integration
```tsx
import { useStreak } from '~/lib/hooks/useStreak';

function MyComponent() {
  const { streakData, recordActivityAction } = useStreak();
  
  const handleModuleComplete = async () => {
    await recordActivityAction({
      type: 'COMPLETE_MODULE',
      description: 'Completed Korean Basics Module 1',
      xpEarned: 50,
      metadata: {
        moduleId: 1,
        courseName: 'Korean Basics'
      }
    });
  };
  
  return (
    <div>
      <p>Current Streak: {streakData?.currentStreak || 0}</p>
      <button onClick={handleModuleComplete}>Complete Module</button>
    </div>
  );
}
```

### Game XP Integration
```tsx
import { useAutoGameXP } from '~/lib/hooks/useGameXP';

function GameOverScreen() {
  const { xpResult, hasEarnedXP } = useAutoGameXP();
  
  return (
    <div>
      {hasEarnedXP && (
        <div>
          <p>XP Earned: +{xpResult.xpEarned}</p>
          {xpResult.leveledUp && <p>🌟 Level Up!</p>}
          {xpResult.streakUpdated && <p>🔥 Streak Updated!</p>}
        </div>
      )}
    </div>
  );
}
```

### Streak Display
```tsx
import { StreakDisplay } from '~/components/StreakDisplay';

function HomeScreen() {
  return (
    <div>
      {/* Full streak information */}
      <StreakDisplay variant="full" />
      
      {/* Compact version for headers */}
      <StreakDisplay variant="compact" />
      
      {/* Minimal for space-constrained areas */}
      <StreakDisplay variant="minimal" />
    </div>
  );
}
```

## Testing

### API Testing
**Location**: `web/tests/test-streak-api.js`

**Run Tests**:
```bash
cd web
node tests/test-streak-api.js
```

**Test Coverage**:
- Authentication verification
- Streak data retrieval
- Activity recording
- Streak updates
- XP calculations
- Level progression

### Manual Testing Checklist

**Daily Login Testing**:
- [ ] App launch records daily login automatically
- [ ] Duplicate logins on same day don't increase streak
- [ ] Consecutive day logins increase streak
- [ ] Missing days reset streak appropriately

**Game Testing**:
- [ ] Game completion records XP
- [ ] XP calculation matches performance
- [ ] Game over screen shows correct information
- [ ] Performance ratings display correctly

**UI Testing**:
- [ ] Streak display updates in real-time
- [ ] Celebration animations work
- [ ] Level progress bars show correctly
- [ ] XP breakdown displays accurately

## Troubleshooting

### Common Issues

**1. Streak not updating**:
- Check authentication token
- Verify API endpoint accessibility
- Check React Query cache invalidation

**2. Game XP not recording**:
- Ensure game completion is detected
- Verify `useAutoGameXP` hook integration
- Check activity type validation

**3. UI not refreshing**:
- Check React Query cache settings
- Verify hook dependencies
- Ensure proper component re-rendering

### Debug Logging
The system includes comprehensive console logging:
- `🔥` Streak operations
- `🎯` Activity recording
- `🎮` Game completion
- `✅` Successful operations
- `❌` Errors and failures

## Performance Considerations

### Optimization Features
- **React Query Caching**: 5-minute stale time for streak data
- **Local Storage**: Prevents duplicate daily login recordings
- **Database Indexing**: Optimized queries for activity logs
- **Transaction Safety**: Database transactions ensure data consistency

### Scaling Considerations
- Activity logs are indexed by user, type, and date
- XP calculations are performed server-side
- Streak logic handles edge cases (timezone, server restarts)
- Metadata stored as JSON for flexibility

## Future Enhancements

### Potential Features
1. **Weekly/Monthly Challenges**: Extended streak periods
2. **Social Features**: Streak comparisons with friends
3. **Achievement Badges**: Milestone rewards
4. **Streak Recovery**: Grace periods for missed days
5. **Advanced Analytics**: Detailed progress tracking
6. **Push Notifications**: Streak reminders
7. **Multiplayer Games**: Team-based XP rewards

### Architecture Improvements
1. **Real-time Updates**: WebSocket integration
2. **Offline Support**: Local streak tracking
3. **A/B Testing**: Different XP reward structures
4. **Advanced Caching**: Redis for high-traffic scenarios

---

## Summary

The Daily Login Streak and Gamification system provides a comprehensive solution for user engagement through:

- **Automated Tracking**: Daily login detection and streak management
- **Flexible XP System**: Multiple activity types with customizable rewards
- **Game Integration**: Performance-based rewards for educational games
- **Beautiful UI**: Multiple display variants with animations
- **Robust Architecture**: Scalable backend with proper error handling
- **Developer-Friendly**: Well-documented hooks and components

The system encourages daily engagement while providing meaningful rewards for learning activities, creating a gamified educational experience that motivates continuous learning.
