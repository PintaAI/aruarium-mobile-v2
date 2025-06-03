// Import necessary components and libraries
import { Text, Animated, View, Image, TouchableOpacity } from 'react-native';
import { Search, User } from 'lucide-react-native';
import { iconWithClassName } from '../lib/icons/iconWithClassName';

// Define the props for the Header component
interface HeaderProps {
  displayName: string;
  headerTranslateYAnim: Animated.Value;
  HEADER_HEIGHT: number;
  userPhotoUrl?: string;
  onSearchPress?: () => void;
  onProfilePress?: () => void;
}

// Create styled icons
const SearchIcon = iconWithClassName(Search);
const UserIcon = iconWithClassName(User);

// Define the Header component
export function Header({ displayName, headerTranslateYAnim, HEADER_HEIGHT, userPhotoUrl, onSearchPress, onProfilePress }: HeaderProps) {
  return (
    // Animated Header section
    <Animated.View
      className="px-6 absolute top-0 left-0 right-0 z-10 bg-background shadow-sm border-b border-border/5 rounded-b-xl" // Added rounded bottom corners
      style={{
        height: HEADER_HEIGHT,
        justifyContent: 'center', // Center content vertically
        transform: [{ translateY: headerTranslateYAnim }],
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5, // For Android shadow
      }}>
      {/* Header content with flex layout */}
      <View className="flex-row items-center justify-between">
        {/* Greeting message */}
        <Text className="text-lg font-semibold text-foreground">
          안녕하세요 👋 {displayName}
        </Text>
        
        {/* Right side with profile photo and search icon */}
        <View className="flex-row items-center gap-3">
          {/* Search icon */}
          <TouchableOpacity
            onPress={onSearchPress}
            className="p-2 rounded-full bg-secondary/10"
          >
            <SearchIcon size={20} className="text-primary" />
          </TouchableOpacity>
          
          {/* User profile photo */}
          <TouchableOpacity
            onPress={onProfilePress}
            className="active:opacity-70"
          >
            {userPhotoUrl ? (
              <Image
                source={{ uri: userPhotoUrl }}
                className="w-8 h-8 rounded-full bg-secondary"
              />
            ) : (
              <View className="w-8 h-8 rounded-full bg-secondary items-center justify-center">
                <UserIcon size={16} className="text-secondary-foreground" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}
