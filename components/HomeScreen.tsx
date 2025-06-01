// Import necessary components and libraries
import { View, Animated, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'; // Removed ScrollView as Animated.ScrollView is used, Removed Text
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState, useRef } from 'react';
import { AppList } from '~/components/AppList';
import { Articles } from '~/components/Articles';
import { RecentVocabulary } from '~/components/RecentVocabulary';
import { getCurrentUser, type UserInfo } from '~/lib/auth';
import { Header } from '~/components/Header'; // Import the new Header component

// Define the HomeScreen component
export function HomeScreen() {
  // State to store user information
  const [user, setUser] = useState<UserInfo | null>(null);
  // Animated value for scroll position
  const scrollY = useRef(new Animated.Value(0)).current;
  // Ref to store the previous scroll position
  const prevScrollY = useRef(0);
  // Animated value for header translation
  const headerTranslateYAnim = useRef(new Animated.Value(0)).current; // Renamed to avoid confusion
  // Ref to store the current numeric value of headerTranslateY for logic
  const currentHeaderTranslateY = useRef(0);
  // Boolean ref to track if scrolling is happening
  const isScrolling = useRef(false);

  // Define header height (adjust as needed)
  const HEADER_HEIGHT = 60;

  // useEffect hook to load user data when the component mounts
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Fetch current user data
        const userData = await getCurrentUser();
        // Set the user data in state
        setUser(userData);
      } catch (error) {
        // Log any errors during user data fetching
        console.error('Error loading user:', error);
      }
    };

    // Call the loadUser function
    loadUser();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Determine the display name based on user data
  const displayName = user?.name || 'Guest';

  // Return the JSX for the HomeScreen
  return (
    // SafeAreaView to ensure content is within safe screen boundaries
    <SafeAreaView className="flex-1" edges={['top']}>
      {/* Inner View for explicit clipping and background */}
      <View className="flex-1 bg-background overflow-hidden">
        {/* Use the new Header component */}
        <Header
          displayName={displayName}
          headerTranslateYAnim={headerTranslateYAnim}
          HEADER_HEIGHT={HEADER_HEIGHT}
        />

      {/* Scrollable content area */}
      <Animated.ScrollView
        className="flex-1" // Removed p-6, will add to inner view
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT + 16, paddingBottom: 24 }} // Add padding for header and original bottom padding
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: true, // Use native driver for performance
            listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => { // Typed the event
              const currentScrollYValue = event.nativeEvent.contentOffset.y;
              const diff = currentScrollYValue - prevScrollY.current;

              if (isScrolling.current) {
                let newTranslateY = currentHeaderTranslateY.current - diff;

                // Clamp the translateY value
                if (newTranslateY < -HEADER_HEIGHT) {
                  newTranslateY = -HEADER_HEIGHT;
                } else if (newTranslateY > 0) {
                  newTranslateY = 0;
                }
                headerTranslateYAnim.setValue(newTranslateY);
                currentHeaderTranslateY.current = newTranslateY; // Update numeric ref
              }
              prevScrollY.current = Math.max(0, currentScrollYValue); // Ensure prevScrollY is not negative
            },
          }
        )}
        onScrollBeginDrag={() => {
          isScrolling.current = true;
        }}
        onScrollEndDrag={() => {
          isScrolling.current = false;
          // Snap header to fully visible or fully hidden
          // const currentScrollVal = prevScrollY.current; // Not directly used for snapping logic here
          const currentHeaderPos = currentHeaderTranslateY.current; // Use the numeric ref

          if (currentHeaderPos < -HEADER_HEIGHT / 2 && currentHeaderPos !== -HEADER_HEIGHT) {
            Animated.timing(headerTranslateYAnim, {
              toValue: -HEADER_HEIGHT,
              duration: 150,
              useNativeDriver: true,
            }).start(() => currentHeaderTranslateY.current = -HEADER_HEIGHT); // Update ref on animation complete
          } else if (currentHeaderPos >= -HEADER_HEIGHT / 2 && currentHeaderPos !== 0) {
            Animated.timing(headerTranslateYAnim, {
              toValue: 0,
              duration: 150,
              useNativeDriver: true,
            }).start(() => currentHeaderTranslateY.current = 0); // Update ref on animation complete
          }
        }}
        scrollEventThrottle={16} // How often scroll event fires (iOS only)
      >
        {/* Main content container */}
        {/* Added px-6 here from original ScrollView */}
        <View className="mx-auto w-full max-w-lg flex gap-6 pb-[120px] px-6">
          {/* AppList component to display a list of apps */}
          <AppList />
          {/* RecentVocabulary component to display recent vocabulary */}
          <RecentVocabulary />
          {/* Articles component to display articles */}
          <Articles />
        </View>
      </Animated.ScrollView>
      </View>
    </SafeAreaView>
  );
}
