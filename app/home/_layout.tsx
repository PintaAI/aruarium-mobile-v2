import { Tabs } from 'expo-router';
import { Home, Book, ListChecks, FileText, User } from 'lucide-react-native';
import { Platform, View } from 'react-native';
import { BlurView } from 'expo-blur';
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
          bottom: 40,
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
              borderRadius: 35,
              borderWidth: 1,
              borderColor: theme.border,
              overflow: 'hidden',
            }}
          >
            <BlurView
              intensity={90}
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
          tabBarIcon: ({ focused }) => (
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
          tabBarIcon: ({ focused }) => (
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
          tabBarIcon: ({ focused }) => (
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
          tabBarIcon: ({ focused }) => (
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
