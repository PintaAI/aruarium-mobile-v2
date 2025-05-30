import { View, TouchableOpacity, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { APPS, AppItem } from '~/lib/apps-constant';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import { useMemo } from 'react';

interface AppIconProps {
  item: AppItem;
  onPress: () => void;
}

function AppIcon({ item, onPress }: AppIconProps) {
  const IconComponent = item.icon;
  // useColorScheme is already imported but not used, let's use it if needed for more complex logic,
  // but NativeWind's dark: prefix should handle this.

  const appClasses = 'bg-blue-100 border-blue-200 dark:bg-blue-700/40 dark:border-blue-500/60';
  const gameClasses = 'bg-red-100 border-red-200 dark:bg-red-700/40 dark:border-red-500/60';
  const appIconClasses = 'text-blue-500 dark:text-blue-300';
  const gameIconClasses = 'text-red-500 dark:text-red-300';

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`w-12 h-12 rounded-full items-center justify-center border-2 ${
        item.type === 'app' ? appClasses : gameClasses
      }`}
      accessibilityLabel={`Open ${item.name}`}
      accessibilityRole="button"
    >
      <IconComponent
        size={22}
        className={item.type === 'app' ? appIconClasses : gameIconClasses}
      />
    </TouchableOpacity>
  );
}

interface AppItemProps {
  item: AppItem;
}

function AppItemComponent({ item }: AppItemProps) {
  const handlePress = () => {
    router.push(item.route as any);
  };
  
  return (
    <View className="items-center w-1/4 my-2">
      <AppIcon 
        item={item} 
        onPress={handlePress}
      />
      <Text className="text-xs text-foreground/80 text-center mt-2">
        {item.name}
      </Text>
    </View>
  );
}

interface AppListProps {
  title?: string;
  showOnlyType?: 'game' | 'app';
}

export function AppList({ title = 'App list', showOnlyType }: AppListProps) {
  const filteredApps = useMemo(() => {
    if (!showOnlyType) return APPS;
    return APPS.filter(app => app.type === showOnlyType);
  }, [showOnlyType]);

  return (
    <View className="w-full">
      <Text className="text-xl font-bold mb-4">{title}</Text>
      <Card className="w-full p-4">
        <View className="flex-row flex-wrap justify-start w-full">
          {filteredApps.map((item) => (
            <AppItemComponent key={item.name} item={item} />
          ))}
        </View>
      </Card>
    </View>
  );
}
