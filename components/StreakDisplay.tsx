import React, { useMemo, useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Animated, Modal, ScrollView } from 'react-native';
import { useStreakDisplay, useStreak } from '~/lib/hooks/useStreak';
import { ActivityLog } from '~/lib/api/streak';
import { getWeekData, getTimeAgo } from '~/lib/utils/streak';
import { ActivityLogViewer } from './ActivityLogViewer';

interface DayData {
  date: Date;
  hasActivity: boolean;
  xpGained: number;
  activities: ActivityLog[];
}

interface StreakDisplayProps {
  variant?: 'calendar' | 'compact' | 'minimal';
  onPress?: () => void;
}

const StatItem = ({ icon, value, label }: { icon: string; value: string | number; label?: string }) => (
  <View className="flex-row items-center gap-1">
    <Text className="text-lg">{icon}</Text>
    <Text className="text-sm font-medium text-foreground">
      {label ? `${label}${value}` : value}
    </Text>
  </View>
);

const DayCircle = ({
  day,
  index,
  dayNames,
  onPress
}: {
  day: DayData;
  index: number;
  dayNames: string[];
  onPress: (day: DayData) => void;
}) => {
  const isToday = day.date.toDateString() === new Date().toDateString();
  const dayNum = day.date.getDate();

  return (
    <View key={index} className="flex-1 items-center gap-1">
      <Text className="text-xs text-muted-foreground font-medium">
        {dayNames[index]}
      </Text>
      <Pressable
        onPress={() => onPress(day)}
        className={`w-10 h-10 rounded-full flex items-center justify-center active:opacity-70 ${
          isToday
            ? "bg-primary ring-2 ring-primary/20"
            : day.hasActivity
              ? "bg-green-100 border-2 border-green-200"
              : "bg-muted"
        }`}
      >
        {day.hasActivity && !isToday && (
          <View className="w-2 h-2 bg-green-500 rounded-full" />
        )}
        {isToday && (
          <Text className="text-sm font-medium text-primary-foreground">
            {dayNum}
          </Text>
        )}
        {!day.hasActivity && !isToday && (
          <Text className="text-sm font-medium text-muted-foreground">
            {dayNum}
          </Text>
        )}
      </Pressable>
    </View>
  );
};

const CelebrationOverlay = ({ shouldShow, icon, title, subtitle }: {
  shouldShow: boolean;
  icon: string;
  title: string;
  subtitle?: string;
}) => {
  if (!shouldShow) return null;
  
  return (
    <View className="absolute inset-0 justify-center items-center bg-black/50 rounded-xl">
      <Text className="text-4xl">{icon}</Text>
      <Text className="text-white font-bold text-lg mt-2">{title}</Text>
      {subtitle && <Text className="text-white text-sm">{subtitle}</Text>}
    </View>
  );
};

const DayActivityModal = ({
  isVisible,
  onClose,
  selectedDay
}: {
  isVisible: boolean;
  onClose: () => void;
  selectedDay: DayData | null;
}) => {
  if (!selectedDay) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-border">
          <View>
            <Text className="text-lg font-semibold text-foreground">
              {formatDate(selectedDay.date)}
            </Text>
            <Text className="text-sm text-muted-foreground">
              {selectedDay.hasActivity
                ? `${selectedDay.xpGained} XP earned • ${selectedDay.activities.length} activities`
                : 'No activities recorded'
              }
            </Text>
          </View>
          <Pressable
            onPress={onClose}
            className="bg-secondary px-4 py-2 rounded-lg active:opacity-80"
          >
            <Text className="text-secondary-foreground font-medium">Close</Text>
          </Pressable>
        </View>

        {/* Content */}
        <ScrollView className="flex-1">
          {selectedDay.hasActivity ? (
            <View className="p-4 gap-4">
              {/* Day Summary */}
              <View className="bg-card p-4 rounded-lg border border-border">
                <View className="flex-row items-center gap-2 mb-3">
                  <Text className="text-2xl">🎯</Text>
                  <Text className="text-lg font-semibold text-foreground">Day Summary</Text>
                </View>
                <View className="flex-row justify-between">
                  <View className="items-center">
                    <Text className="text-2xl font-bold text-primary">{selectedDay.activities.length}</Text>
                    <Text className="text-xs text-muted-foreground">Activities</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-2xl font-bold text-purple-500">{selectedDay.xpGained}</Text>
                    <Text className="text-xs text-muted-foreground">XP Earned</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-2xl">🔥</Text>
                    <Text className="text-xs text-muted-foreground">Active Day</Text>
                  </View>
                </View>
              </View>

              {/* Activities List */}
              <View className="bg-card p-4 rounded-lg border border-border">
                <Text className="text-lg font-semibold text-foreground mb-3">Activities</Text>
                <View className="gap-3">
                  {selectedDay.activities.map((activity, index) => (
                    <View key={index} className="border-l-4 border-primary pl-3 py-2">
                      <Text className="font-medium text-foreground">{activity.type?.replace(/_/g, ' ')}</Text>
                      {activity.description && (
                        <Text className="text-sm text-muted-foreground mt-1">{activity.description}</Text>
                      )}
                      <View className="flex-row items-center gap-4 mt-2">
                        {activity.xpEarned && (
                          <View className="flex-row items-center gap-1">
                            <Text className="text-purple-500">💎</Text>
                            <Text className="text-xs font-medium text-purple-500">+{activity.xpEarned} XP</Text>
                          </View>
                        )}
                        <Text className="text-xs text-muted-foreground">
                          {new Date(activity.createdAt).toLocaleTimeString()}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ) : (
            <View className="flex-1 items-center justify-center p-8">
              <Text className="text-6xl mb-4">😴</Text>
              <Text className="text-lg font-semibold text-foreground mb-2">No Activity</Text>
              <Text className="text-muted-foreground text-center">
                No learning activities were recorded on this day. Keep up your streak!
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

export function StreakDisplay({ variant = 'calendar', onPress }: StreakDisplayProps) {
  const streakDisplay = useStreakDisplay();
  const { streakData, hasLeveledUp, shouldShowStreakCelebration } = useStreak();
  const [isProgressExpanded, setIsProgressExpanded] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [isDayModalVisible, setIsDayModalVisible] = useState(false);
  const expandAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  const weekData = useMemo(() =>
    getWeekData(streakData?.recentActivities || []),
    [streakData?.recentActivities]
  );
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const nextLevelXP = streakDisplay.level * 1000;
  const lastActivity = streakData?.recentActivities?.[0];

  const toggleProgressDetails = () => {
    const toValue = isProgressExpanded ? 0 : 1;
    
    Animated.timing(expandAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    setIsProgressExpanded(!isProgressExpanded);
  };

  const handleDayPress = (day: DayData) => {
    setSelectedDay(day);
    setIsDayModalVisible(true);
  };

  const closeDayModal = () => {
    setIsDayModalVisible(false);
    setSelectedDay(null);
  };

  // Pulse animation for progress bar
  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    
    pulse();
  }, [pulseAnimation]);

  const renderVariant = () => {
    switch (variant) {
      case 'minimal':
        return (
          <View className="flex-row items-center gap-2">
            <Text className="text-2xl">🔥</Text>
            <Text className="text-lg font-bold text-primary">
              {streakDisplay.currentStreak}
            </Text>
          </View>
        );

      case 'compact':
        return (
          <View className="flex-row items-center gap-3 bg-card p-3 rounded-lg border border-border">
            <StatItem icon="🔥" value={streakDisplay.currentStreak} />
            <StatItem icon="⭐" value={streakDisplay.level} label="Lv." />
            <StatItem icon="💎" value={streakDisplay.xp} />
          </View>
        );

      default: // calendar
        return (
          <View className="w-full gap-2">
            {/* Weekly Calendar */}
            <View className="bg-card p-4 rounded-lg border border-border">
              <View className="flex-row items-center justify-between gap-4 mb-4">
                <Text className="font-semibold text-lg text-foreground">Daily Streak</Text>
                <View className="flex-row items-center gap-1">
                  <Text className="text-orange-500 text-lg">🔥</Text>
                  <Text className="font-bold text-orange-500">{streakDisplay.currentStreak}</Text>
                </View>
              </View>

              <View className="flex-row gap-2">
                {weekData.map((day, index) => (
                  <DayCircle
                    key={index}
                    day={day}
                    index={index}
                    dayNames={dayNames}
                    onPress={handleDayPress}
                  />
                ))}
              </View>
            </View>

            {/* Simplified Progress Bar */}
            <Pressable
              onPress={toggleProgressDetails}
              className="bg-card p-4 rounded-lg border border-border active:opacity-80"
            >
              {/* Always visible: Level and Progress Bar */}
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center gap-2">
                  <Text className="text-yellow-500 text-lg">⚡</Text>
                  <Text className="font-semibold text-foreground">Level {streakDisplay.level}</Text>
                </View>
                <Text className="text-sm text-muted-foreground">
                  {streakDisplay.xp} / {nextLevelXP} XP
                </Text>
              </View>

              <View className="gap-2">
                <View className="bg-secondary rounded-full h-3 overflow-hidden">
                  <Animated.View
                    className="bg-primary rounded-full h-3"
                    style={{
                      width: `${streakDisplay.xpProgress}%`,
                      transform: [{ scaleY: pulseAnimation }],
                    }}
                  />
                </View>
                
                {/* Simple progress indicator with fade animation */}
                <Animated.View
                  style={{
                    opacity: expandAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0],
                    }),
                  }}
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs text-muted-foreground">
                      {streakDisplay.xpToNextLevel} XP to next level
                    </Text>
                    <Text className="text-xs text-muted-foreground">Tap for details</Text>
                  </View>
                </Animated.View>
              </View>

              {/* Expanded Details with slide animation */}
              <Animated.View
                style={{
                  maxHeight: expandAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 200],
                  }),
                  opacity: expandAnimation.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 0, 1],
                  }),
                  transform: [{
                    translateY: expandAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }),
                  }],
                  overflow: 'hidden',
                }}
              >
                <View className="mt-4 gap-3">
                  {/* XP Progress Details */}
                  <View className="bg-secondary/50 p-3 rounded-lg">
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="text-sm font-medium text-foreground">Progress Details</Text>
                      <Text className="text-xs text-muted-foreground">
                        {Math.round(streakDisplay.xpProgress)}% complete
                      </Text>
                    </View>
                    <Text className="text-xs text-muted-foreground">
                      {streakDisplay.xpToNextLevel} XP needed to reach Level {streakDisplay.level + 1}
                    </Text>
                  </View>

                  {/* Statistics Row */}
                  <View className="flex-row justify-between items-center pt-2 border-t border-border/50">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-amber-500 text-lg">🏆</Text>
                      <View>
                        <Text className="text-xs text-muted-foreground">Best Streak</Text>
                        <Text className="text-sm font-semibold text-foreground">
                          {streakDisplay.maxStreak} days
                        </Text>
                      </View>
                    </View>

                    {lastActivity && (
                      <View className="bg-green-100 px-3 py-1 rounded-full">
                        <Text className="text-xs text-green-700 font-medium">
                          +{lastActivity.xpEarned || 0} XP {getTimeAgo(lastActivity.createdAt)}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Tap hint */}
                  <Text className="text-xs text-muted-foreground text-center mt-1">
                    Tap again to collapse
                  </Text>
                </View>
              </Animated.View>
            </Pressable>
          </View>
        );
    }
  };

  const Component = onPress ? Pressable : View;

  return (
    <>
      <Component onPress={onPress} className={onPress ? "active:opacity-80" : ""}>
        {renderVariant()}
        
        <CelebrationOverlay
          shouldShow={shouldShowStreakCelebration}
          icon="🔥"
          title="Streak Updated!"
        />
        
        <CelebrationOverlay
          shouldShow={hasLeveledUp}
          icon="⭐"
          title="Level Up!"
          subtitle={`You reached Level ${streakDisplay.level}!`}
        />
      </Component>

      <DayActivityModal
        isVisible={isDayModalVisible}
        onClose={closeDayModal}
        selectedDay={selectedDay}
      />
    </>
  );
}
