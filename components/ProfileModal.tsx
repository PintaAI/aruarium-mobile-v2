import React from 'react';
import { View, ScrollView, Image, Alert, Modal, Pressable } from 'react-native';
import { Text } from '~/components/ui/text';
import { ThemeToggle } from '~/components/ThemeToggle';
import { Card } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { User, Settings, ChevronRight, Bell, Shield, HelpCircle, LogOut, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { logout, getCurrentUser, UserInfo, getToken } from '~/lib/auth';
import { iconWithClassName } from '~/lib/icons/iconWithClassName';

const UserIcon = iconWithClassName(User);
const SettingsIcon = iconWithClassName(Settings);
const BellIcon = iconWithClassName(Bell);
const ShieldIcon = iconWithClassName(Shield);
const HelpCircleIcon = iconWithClassName(HelpCircle);
const LogOutIcon = iconWithClassName(LogOut);
const XIcon = iconWithClassName(X);
const ChevronRightIcon = iconWithClassName(ChevronRight);

const MENU_ITEMS = [
  {
    icon: SettingsIcon,
    title: 'App Settings',
    description: 'Theme, notifications, language'
  },
  {
    icon: BellIcon,
    title: 'Notifications',
    description: 'Configure notifications'
  },
  {
    icon: ShieldIcon,
    title: 'Privacy',
    description: 'Manage your data and privacy'
  },
  {
    icon: HelpCircleIcon,
    title: 'Help & Support',
    description: 'FAQs and contact support'
  }
];

interface ProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export function ProfileModal({ isVisible, onClose }: ProfileModalProps) {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [rawToken, setRawToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch user information from JWT token
  useEffect(() => {
    if (isVisible) {
      async function fetchUserInfo() {
        try {
          const user = await getCurrentUser();
          const token = await getToken();
          setUserInfo(user);
          setRawToken(token);
        } catch (error) {
          console.error('Error fetching user info:', error);
        } finally {
          setLoading(false);
        }
      }
      
      fetchUserInfo();
    }
  }, [isVisible]);
  
  const handleLogout = async () => {
    try {
      await logout();
      onClose();
      router.replace('/auth/login' as any);
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };
  
  // Get appropriate display values from user info
  const displayName = userInfo?.name || userInfo?.email?.split('@')[0] || 'User';
  const displayEmail = userInfo?.email || 'No email available';
  const profileImage = userInfo?.image || 'https://github.com/shadcn.png';

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-background">
        {/* Modal Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-border">
          <Text className="text-lg font-semibold text-foreground">Profile & Settings</Text>
          <Pressable
            onPress={onClose}
            className="p-2 rounded-lg bg-secondary/10 active:opacity-80"
          >
            <XIcon size={20} className="text-foreground" />
          </Pressable>
        </View>

        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Profile Header */}
          <View className="items-center pt-6 pb-6 gap-3 bg-card mx-4 mt-4 rounded-xl">
            <View className="w-20 h-20 rounded-full overflow-hidden">
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
                    <UserIcon size={18} className="text-primary" />
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
                <Pressable 
                  key={index} 
                  className="flex-row items-center justify-between p-4 active:bg-secondary/10"
                >
                  <View className="flex-row items-center gap-3">
                    <View className="w-8 h-8 rounded-full items-center justify-center bg-primary/10">
                      <item.icon size={18} className="text-primary" />
                    </View>
                    <View>
                      <Text className="font-medium">{item.title}</Text>
                      <Text className="text-sm text-muted-foreground">{item.description}</Text>
                    </View>
                  </View>
                  <ChevronRightIcon size={20} className="text-muted-foreground" />
                </Pressable>
              ))}
            </Card>

            {/* Logout Button */}
            <Button 
              variant="destructive" 
              className="mt-4"
              onPress={handleLogout}
            >
              <View className="flex-row items-center justify-center">
                <LogOutIcon size={18} className="mr-2 text-destructive-foreground" />
                <Text className="text-destructive-foreground font-medium">Logout</Text>
              </View>
            </Button>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}