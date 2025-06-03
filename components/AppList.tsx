import { View, TouchableOpacity, Pressable } from 'react-native';
import { router } from 'expo-router';
import { APPS, AppItem, getAppsByType } from '~/lib/apps-constant';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import { useMemo, useState } from 'react';
import { Gamepad2, Sparkles, ChevronRight, Play } from 'lucide-react-native';
import { iconWithClassName } from '~/lib/icons/iconWithClassName';

const GamepadIcon = iconWithClassName(Gamepad2);
const SparklesIcon = iconWithClassName(Sparkles);
const ChevronRightIcon = iconWithClassName(ChevronRight);
const PlayIcon = iconWithClassName(Play);

interface AppItemProps {
  item: AppItem;
  variant?: 'card' | 'list';
}

function AppItemComponent({ item, variant = 'card' }: AppItemProps) {
  const IconComponent = item.icon;
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    router.push(item.route as any);
  };

  if (variant === 'list') {
    return (
      <Pressable
        onPress={handlePress}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        className={`flex-row items-center p-4 rounded-xl border ${
          isPressed ? 'bg-primary/10 border-primary/30' : 'bg-card border-border'
        }`}
        accessibilityLabel={`Open ${item.name}`}
        accessibilityRole="button"
      >
        <View className={`w-12 h-12 rounded-xl items-center justify-center border ${
          item.type === 'game'
            ? 'bg-purple-100 border-purple-200 dark:bg-purple-900/30 dark:border-purple-700/50'
            : 'bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700/50'
        }`}>
          <IconComponent
            size={24}
            className={item.type === 'game' ? 'text-purple-600 dark:text-purple-400' : 'text-blue-600 dark:text-blue-400'}
          />
        </View>
        
        <View className="flex-1 ml-4">
          <Text className="font-semibold text-foreground">{item.name}</Text>
          <Text className="text-sm text-muted-foreground">
            {item.description}
          </Text>
        </View>
        
        <ChevronRightIcon size={20} className="text-muted-foreground" />
      </Pressable>
    );
  }

  // Card variant (default) - now only used for apps
  if (item.type === 'app') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        className="flex-1 min-w-[120px] max-w-[140px] mx-1 mb-3"
        accessibilityLabel={`Open ${item.name}`}
        accessibilityRole="button"
        activeOpacity={0.7}
      >
        <Card className="p-4 h-28 items-center justify-center">
          <View className="w-12 h-12 rounded-xl items-center justify-center mb-2 bg-blue-100 dark:bg-blue-900/30">
            <IconComponent
              size={24}
              className="text-blue-600 dark:text-blue-400"
            />
          </View>
          <Text className="text-sm font-medium text-center text-foreground leading-tight">
            {item.name}
          </Text>
        </Card>
      </TouchableOpacity>
    );
  }

  // Game variant - simple column layout with icon and name
  return (
    <TouchableOpacity
      onPress={handlePress}
      className="items-center p-4 mb-3 rounded-xl bg-card "
      accessibilityLabel={`Open ${item.name}`}
      accessibilityRole="button"
      activeOpacity={0.7}
    >
      <View className="w-14 h-14 rounded-xl items-center justify-center mb-3 bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700/50">
        <IconComponent
          size={28}
          className="text-purple-600 dark:text-purple-400"
        />
      </View>
      
      <Text className="text-sm font-medium text-center text-foreground">
        {item.name}
      </Text>
    </TouchableOpacity>
  );
}

interface SectionHeaderProps {
  title: string;
  icon: React.ComponentType<any>;
  count: number;
}

function SectionHeader({ title, icon: Icon, count }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center mb-3">
      <View className="w-8 h-8 rounded-lg bg-primary/10 items-center justify-center mr-3">
        <Icon size={18} className="text-primary" />
      </View>
      <Text className="text-lg font-bold text-foreground flex-1">{title}</Text>
      <View className="bg-secondary/20 px-2 py-1 rounded-full">
        <Text className="text-xs font-medium text-muted-foreground">{count}</Text>
      </View>
    </View>
  );
}

interface AppListProps {
  variant?: 'card' | 'list' | 'mixed';
  showSeparately?: boolean;
}

export function AppList({ variant = 'mixed', showSeparately = true }: AppListProps) {
  const apps = useMemo(() => getAppsByType('app'), []);
  const games = useMemo(() => getAppsByType('game'), []);

  if (!showSeparately) {
    return (
      <View className="w-full">
        <SectionHeader
          title="Apps & Games"
          icon={SparklesIcon}
          count={APPS.length}
        />
        
        {variant === 'list' ? (
          <View className="gap-2">
            {APPS.map((item) => (
              <AppItemComponent key={item.name} item={item} variant="list" />
            ))}
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between">
            {APPS.map((item) => (
              <AppItemComponent key={item.name} item={item} variant="card" />
            ))}
          </View>
        )}
      </View>
    );
  }

  return (
    <View className="w-full gap-6">
      {/* Games Section */}
      {games.length > 0 && (
        <View>
          <SectionHeader
            title="Games"
            icon={GamepadIcon}
            count={games.length}
          />
          
          <View className="flex-row flex-wrap justify-between">
            {games.map((item) => (
              <View key={item.name} className="w-[29%]">
                <AppItemComponent item={item} variant="card" />
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Apps Section */}
      {apps.length > 0 && (
        <View>
          <SectionHeader
            title="Study Tools"
            icon={SparklesIcon}
            count={apps.length}
          />
          
          {variant === 'mixed' || variant === 'list' ? (
            <View className="gap-2">
              {apps.map((item) => (
                <AppItemComponent key={item.name} item={item} variant="list" />
              ))}
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {apps.map((item) => (
                <AppItemComponent key={item.name} item={item} variant="card" />
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
