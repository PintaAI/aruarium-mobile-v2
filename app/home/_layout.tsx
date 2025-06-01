import { Tabs } from 'expo-router';
import { Home, Book, ListChecks, FileText, User } from 'lucide-react-native';
import { Platform, Pressable, View } from 'react-native';
import { BlurView } from 'expo-blur';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { cssInterop } from 'nativewind';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';

// Apply cssInterop to icons
[Home, Book, ListChecks, FileText, User].forEach((icon) => {
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

export default function HomeLayout() {
  const { isDarkColorScheme } = useColorScheme();
  const theme = isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light;

  return (
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: route.name !== 'fyp-soal' && route.name !== 'index',
          headerPressColor: 'transparent',
          tabBarShowLabel: false,
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.border,
          tabBarButton: Platform.OS === 'android'
            ? (props: BottomTabBarButtonProps) => (
                <Pressable
                  android_ripple={null}
                  onPress={props.onPress}
                  style={props.style}
                >
                  {props.children}
                </Pressable>
              )
            : undefined,
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            borderTopColor: theme.border,
            height: Platform.OS === 'android' ? 64 : 70,
            overflow: 'hidden',
            // Pill shape styling
            left: 20,
            right: 20,
            bottom: 40,
            borderRadius: 30,
            marginHorizontal: 12,
            paddingHorizontal: 8,
          },
          tabBarBackground: () => (
            <BlurView
              intensity={90}
              tint={isDarkColorScheme ? "dark" : "light"}
              experimentalBlurMethod={Platform.OS === 'android' ? "dimezisBlurView" : undefined}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 35,
            
              }}
            />
          ),
          tabBarItemStyle: {
            marginVertical: 15,
            flex: 1,
          }
        })}
      >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, size }) => (
            <Home 
              className={focused ? 'text-primary' : 'text-muted-foreground'} 
              strokeWidth={focused ? 2 : 1.5}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="course"
        options={{
          title: 'Course',
          tabBarIcon: ({ focused, size }) => (
            <Book 
              className={focused ? 'text-primary' : 'text-muted-foreground'} 
              strokeWidth={focused ? 2 : 1.5}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="fyp-soal"
        options={{
          title: 'FYP Soal',
          tabBarIcon: ({ focused, size }) => (
            <ListChecks 
              className={focused ? 'text-primary' : 'text-muted-foreground'} 
              strokeWidth={focused ? 2 : 1.5}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="vocab"
        options={{
          title: 'Vocab',
          tabBarIcon: ({ focused, size }) => (
            <FileText 
              className={focused ? 'text-primary' : 'text-muted-foreground'} 
              strokeWidth={focused ? 2 : 1.5}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, size }) => (
            <User 
              className={focused ? 'text-primary' : 'text-muted-foreground'} 
              strokeWidth={focused ? 2 : 1.5}
            />
          ),
        }}
      />
      </Tabs>
  );
}
