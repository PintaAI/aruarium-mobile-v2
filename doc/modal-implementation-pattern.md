# Modal Implementation Pattern Documentation

## Overview

This document describes the modal implementation pattern used in the StreakDisplay component for displaying day-specific activity details. This pattern provides a clean, reusable approach for implementing modals in React Native with TypeScript.

## Implementation Pattern

### 1. Modal Component Structure

```typescript
const DayActivityModal = ({ 
  isVisible, 
  onClose, 
  selectedDay 
}: { 
  isVisible: boolean; 
  onClose: () => void; 
  selectedDay: DayData | null;
}) => {
  if (!selectedDay) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-background">
        {/* Modal Content */}
      </View>
    </Modal>
  );
};
```

### 2. State Management

In the parent component, manage modal state with these hooks:

```typescript
const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
const [isDayModalVisible, setIsDayModalVisible] = useState(false);
```

### 3. Modal Control Functions

```typescript
const handleDayPress = (day: DayData) => {
  setSelectedDay(day);
  setIsDayModalVisible(true);
};

const closeDayModal = () => {
  setIsDayModalVisible(false);
  setSelectedDay(null);
};
```

### 4. Modal Integration

```typescript
return (
  <>
    {/* Main Component Content */}
    <Component>
      {/* Component content with triggers */}
    </Component>

    {/* Modal Component */}
    <DayActivityModal
      isVisible={isDayModalVisible}
      onClose={closeDayModal}
      selectedDay={selectedDay}
    />
  </>
);
```

## Key Features

### 1. Modal Configuration

- **`animationType="slide"`**: Provides smooth slide-up animation
- **`presentationStyle="pageSheet"`**: iOS-style sheet presentation
- **`onRequestClose`**: Handles Android back button and iOS swipe gestures

### 2. Header Design

```typescript
<View className="flex-row items-center justify-between p-4 border-b border-border">
  <View>
    <Text className="text-lg font-semibold text-foreground">
      {formatDate(selectedDay.date)}
    </Text>
    <Text className="text-sm text-muted-foreground">
      {/* Subtitle information */}
    </Text>
  </View>
  <Pressable
    onPress={onClose}
    className="bg-secondary px-4 py-2 rounded-lg active:opacity-80"
  >
    <Text className="text-secondary-foreground font-medium">Close</Text>
  </Pressable>
</View>
```

### 3. Scrollable Content

```typescript
<ScrollView className="flex-1">
  {/* Modal content */}
</ScrollView>
```

### 4. Conditional Rendering

```typescript
{selectedDay.hasActivity ? (
  <View className="p-4 gap-4">
    {/* Activity content */}
  </View>
) : (
  <View className="flex-1 items-center justify-center p-8">
    {/* Empty state */}
  </View>
)}
```

## Best Practices

### 1. Type Safety

- Always define proper TypeScript interfaces for modal props
- Use null checks for optional data (`if (!selectedDay) return null`)
- Type your state variables correctly

### 2. State Management

- Initialize selected data as null
- Reset state when closing modal
- Use separate boolean for modal visibility

### 3. Accessibility

- Include `onRequestClose` for proper back button handling
- Use semantic text hierarchy (headings, descriptions)
- Provide clear close actions

### 4. Styling

- Use consistent spacing with gap classes
- Apply proper background colors for different themes
- Include active states for interactive elements

### 5. Performance

- Keep modal components lightweight
- Avoid heavy computations inside modal renders
- Use conditional rendering to prevent unnecessary renders

## Usage Examples

### Basic Modal Trigger

```typescript
<Pressable
  onPress={() => handleItemPress(item)}
  className="active:opacity-70"
>
  <Text>Open Details</Text>
</Pressable>
```

### Modal with Complex Data

```typescript
interface DetailModalProps {
  isVisible: boolean;
  onClose: () => void;
  data: ComplexData | null;
  additionalProps?: any;
}
```

### Modal with Actions

```typescript
<View className="flex-row gap-2 p-4 border-t border-border">
  <Button onPress={handlePrimaryAction} className="flex-1">
    <Text>Primary Action</Text>
  </Button>
  <Button onPress={onClose} variant="outline" className="flex-1">
    <Text>Cancel</Text>
  </Button>
</View>
```

## Animation Considerations

### Available Animation Types

- `"slide"`: Slides up from bottom (recommended for mobile)
- `"fade"`: Fades in/out
- `"none"`: No animation

### Presentation Styles (iOS)

- `"pageSheet"`: Partial screen coverage (recommended)
- `"formSheet"`: Form-style presentation
- `"fullScreen"`: Full screen coverage

## Error Handling

```typescript
const DayActivityModal = ({ isVisible, onClose, selectedDay }) => {
  if (!selectedDay) return null;
  
  try {
    // Modal content rendering
  } catch (error) {
    console.error('Modal rendering error:', error);
    return (
      <Modal visible={isVisible} onRequestClose={onClose}>
        <View className="flex-1 justify-center items-center">
          <Text>Error loading content</Text>
          <Button onPress={onClose}>
            <Text>Close</Text>
          </Button>
        </View>
      </Modal>
    );
  }
};
```

## Testing Considerations

1. Test modal opening/closing states
2. Verify data is properly passed and displayed
3. Test back button behavior on Android
4. Verify swipe-to-close on iOS (when using pageSheet)
5. Test with different screen sizes

## Related Files

- [`mobile/components/StreakDisplay.tsx`](../components/StreakDisplay.tsx) - Implementation example
- [`mobile/components/ActivityLogViewer.tsx`](../components/ActivityLogViewer.tsx) - Related component

## Future Enhancements

1. Add modal backdrop blur effect
2. Implement custom modal animations
3. Add modal size variants (small, medium, large)
4. Create reusable modal wrapper component
5. Add keyboard avoidance for forms in modals