import { Tabs } from 'expo-router';
import { Home, Book, ListChecks, FileText, Trophy } from 'lucide-react-native';
import { Platform, View, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { cssInterop } from 'nativewind';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { useEffect, useRef } from 'react';

// Apply cssInterop to icons
[Home, Book, ListChecks, FileText, Trophy].forEach((icon) => {
  cssInterop(icon, {
    className: {
      target: 'style',
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
  });
});

// Animated tab icon component
const AnimatedTabIcon = ({ IconComponent, focused, theme }: {
  IconComponent: any;
  focused: boolean;
  theme: any;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: focused ? 1.3 : 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [focused, scaleAnim]);

  return (
    <View
      style={{
        width: 68,
        height: 68,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 12,
        // Debug border to show touchable area
        borderWidth: 0,
       
      }}
    >
      <Animated.View 
        style={{ 
          transform: [{ scale: scaleAnim }],
        }}
      >
        <IconComponent 
          className={focused ? 'text-primary' : 'text-muted-foreground'}
          strokeWidth={focused ? 2 : 1.5}
          size={22}
        />
      </Animated.View>
    </View>
  );
};

export default function HomeLayout() {
  const { isDarkColorScheme } = useColorScheme();
  const theme = isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: route.name !== 'fyp-soal' && route.name !== 'index',
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.border,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          height: Platform.OS === 'android' ? 64 : 60,
          left: 20,
          right: 20,
          bottom: 35,
          borderRadius: 35,
          marginHorizontal: 12,
          paddingHorizontal: 10,
          // Shadow for iOS
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          // Shadow for Android
          elevation: 8,
        },
        tabBarBackground: () => (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: theme.border,
              overflow: 'hidden',
            }}
          >
            <BlurView
              intensity={100}
              tint={isDarkColorScheme ? "dark" : "light"}
              experimentalBlurMethod={Platform.OS === 'android' ? "dimezisBlurView" : undefined}
              style={{
                flex: 1,
              }}
            />
          </View>
        ),
        tabBarItemStyle: {
          marginVertical: 12,
          flex: 1,
        }
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon
              IconComponent={Home}
              focused={focused}
              theme={theme}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="course"
        options={{
          title: 'Course',
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon
              IconComponent={Book}
              focused={focused}
              theme={theme}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="fyp-soal"
        options={{
          title: 'FYP Soal',
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon
              IconComponent={ListChecks}
              focused={focused}
              theme={theme}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="vocab"
        options={{
          title: 'Vocab',
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon
              IconComponent={FileText}
              focused={focused}
              theme={theme}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon
              IconComponent={Trophy}
              focused={focused}
              theme={theme}
            />
          ),
        }}
      />
    </Tabs>
  );
}
