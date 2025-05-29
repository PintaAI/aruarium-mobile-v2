# Word Selector Component Implementation Task

## Overview
Create a `WordSelector` component that displays vocabulary collections from the API and allows users to select a collection for use in the Z-Type game.

## Task Checklist

### 1. Component Structure
- [x] Create `WordSelector` component in `mobile/components/game/WordSelector.tsx`
- [x] Design component interface/props
- [x] Implement basic UI layout

### 2. API Integration
- [x] Integrate with existing vocabulary API (`mobile/lib/api/vocabulary.ts`)
- [x] Fetch vocabulary collections on component mount
- [x] Handle loading states
- [x] Handle error states
- [x] Implement retry mechanism

### 3. Collection Display
- [x] Display list of available vocabulary collections
- [x] Show collection metadata (title, description, item count)
- [x] Implement collection selection functionality
- [x] Add visual feedback for selected collection

### 4. Data Transformation
- [x] Create utility function to convert `VocabularyItem[]` to `WordItem[]`
- [x] Handle data mapping between API format and game format:
  - `VocabularyItem.korean` → `WordItem.name`
  - `VocabularyItem.indonesian` → `WordItem.meaning`
  - `VocabularyItem.id` → `WordItem.id` (convert number to string)

### 5. Integration with Z-Type Game
- [x] Modify `StartScreen` component to include `WordSelector`
- [x] Update game flow to use selected vocabulary collection
- [x] Maintain backward compatibility with static word collection
- [x] Update `startGame` function to accept vocabulary source

### 6. UI/UX Enhancements
- [x] Add search functionality for collections
- [x] Implement filter options (public/private collections)
- [ ] Add loading skeletons
- [x] Implement pull-to-refresh functionality
- [x] Add empty state when no collections available

### 7. Error Handling
- [ ] Handle network errors gracefully
- [ ] Provide fallback to static words if API fails
- [ ] Show user-friendly error messages
- [ ] Implement offline detection

### 8. Testing & Validation
- [ ] Test with different collection sizes
- [ ] Test with empty collections
- [ ] Test network failure scenarios
- [ ] Validate data transformation accuracy
- [ ] Test game integration end-to-end

## Technical Requirements

### Component Props Interface
```typescript
interface WordSelectorProps {
  onWordsSelected: (words: WordItem[], source: 'api' | 'static') => void;
  selectedLevel: number;
  isVisible: boolean;
  onClose: () => void;
}
```

### Data Transformation Function
```typescript
function transformVocabularyToWords(items: VocabularyItem[]): WordItem[] {
  return items.map(item => ({
    id: item.id.toString(),
    name: item.korean,
    meaning: item.indonesian
  }));
}
```

### API Integration Points
- Use `getVocabularyCollections()` for collection list
- Use `getVocabularyCollection(id)` for collection details
- Handle `VocabularyApiError` appropriately

## Implementation Priority
1. **High Priority**: Basic component with API integration
2. **Medium Priority**: UI/UX enhancements and error handling
3. **Low Priority**: Advanced features like search and filters

## Success Criteria
- [x] Component successfully fetches and displays vocabulary collections
- [x] User can select a collection and use it in Z-Type game
- [x] Game works seamlessly with both API and static word sources
- [x] Error states are handled gracefully
- [x] Component is reusable and well-documented

## Files to Create/Modify
- **New**: `mobile/components/game/WordSelector.tsx`
- **New**: `mobile/lib/game/vocabulary-transformer.ts`
- **Modify**: `mobile/components/game/StartScreen.tsx`
- **Modify**: `mobile/app/game/z-type.tsx`
- **Test**: Create test scenarios for the new component

## Dependencies
- Existing vocabulary API (`mobile/lib/api/vocabulary.ts`)
- Existing game types (`mobile/lib/game/word-constant.ts`)
- UI components (`mobile/components/ui/`)
- Game store (`mobile/lib/game/z-type/store/gameStore.ts`)
