// Import necessary components and libraries
import { Text, Animated } from 'react-native';

// Define the props for the Header component
interface HeaderProps {
  displayName: string;
  headerTranslateYAnim: Animated.Value;
  HEADER_HEIGHT: number;
}

// Define the Header component
export function Header({ displayName, headerTranslateYAnim, HEADER_HEIGHT }: HeaderProps) {
  return (
    // Animated Header section
    <Animated.View
      className="px-6 absolute top-0 left-0 right-0 z-10 bg-background" // Added background to match original behavior
      style={{
        height: HEADER_HEIGHT,
        justifyContent: 'center', // Center text vertically
        transform: [{ translateY: headerTranslateYAnim }],
      }}>
      {/* Greeting message */}
      <Text className="text-2xl font-bold text-foreground">
        안녕하세요 👋 {displayName}
      </Text>
    </Animated.View>
  );
}
