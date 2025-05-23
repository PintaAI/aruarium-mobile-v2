import { View, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { Text } from '~/components/ui/text';
import { ThemeToggle } from '~/components/ThemeToggle';
import { Avatar } from '~/components/ui/avatar';
import { Card } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { User, Settings, ChevronRight, Bell, Shield, HelpCircle, LogOut } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { logout, getCurrentUser, UserInfo } from '~/lib/auth';

const MENU_ITEMS = [
  {
    icon: Settings,
    title: 'App Settings',
    description: 'Theme, notifications, language'
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'Configure notifications'
  },
  {
    icon: Shield,
    title: 'Privacy',
    description: 'Manage your data and privacy'
  },
  {
    icon: HelpCircle,
    title: 'Help & Support',
    description: 'FAQs and contact support'
  }
];

export default function Profile() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch user information from JWT token
  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const user = await getCurrentUser();
        setUserInfo(user);
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserInfo();
  }, []);
  
  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/auth/login' as any);
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };
  
  // Get appropriate display values from user info
  const displayName = userInfo?.name || userInfo?.email?.split('@')[0] || 'User';
  const displayEmail = userInfo?.email || 'No email available';
  const profileImage = userInfo?.picture || 'https://github.com/shadcn.png';
  
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-muted-foreground">Loading profile...</Text>
      </View>
    );
  }
  
  return (
    <ScrollView className="flex-1 bg-background">
      {/* Profile Header */}
      <View className="items-center pt-8 pb-6 gap-3 bg-card">
        <View className="w-24 h-24 rounded-full overflow-hidden">
          <Image 
            source={{ uri: profileImage }}
            className="w-full h-full"
            accessibilityLabel="Profile picture"
          />
        </View>
        <View className="items-center">
          <Text className="text-lg font-semibold">{displayName}</Text>
          <Text className="text-sm text-muted-foreground">{displayEmail}</Text>
          {userInfo?.role && (
            <Text className="text-xs text-primary mt-1">Role: {userInfo.role}</Text>
          )}
        </View>
      </View>

      {/* Settings Menu */}
      <View className="p-4 gap-4">
        {/* Theme Toggle Card */}
        <Card className="p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="w-8 h-8 rounded-full items-center justify-center bg-primary/10">
                <User size={18} className="text-primary" />
              </View>
              <View>
                <Text className="font-medium">Theme</Text>
                <Text className="text-sm text-muted-foreground">Change app appearance</Text>
              </View>
            </View>
            <ThemeToggle />
          </View>
        </Card>

        {/* Menu Items */}
        <Card className="divide-y divide-border">
          {MENU_ITEMS.map((item, index) => (
            <View key={index} className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-full items-center justify-center bg-primary/10">
                  <item.icon size={18} className="text-primary" />
                </View>
                <View>
                  <Text className="font-medium">{item.title}</Text>
                  <Text className="text-sm text-muted-foreground">{item.description}</Text>
                </View>
              </View>
              <ChevronRight size={20} className="text-muted-foreground" />
            </View>
          ))}
        </Card>
        
        {/* Logout Button */}
        <Button 
          variant="destructive" 
          className="mt-4"
          onPress={handleLogout}
        >
          <View className="flex-row items-center justify-center">
            <LogOut size={18} className="mr-2 text-destructive-foreground" />
            <Text className="text-destructive-foreground font-medium">Logout</Text>
          </View>
        </Button>
      </View>
    </ScrollView>
  );
}
